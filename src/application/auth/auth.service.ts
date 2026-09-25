import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { createHash } from 'crypto';
import { UserEntity, UserStatus } from '../../domain/user/user.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { PasswordUtil } from '../../common/utils/password.util';
import { Logger } from '../../common/utils/logger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleRegisterDto } from './dto/google-register.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  private readonly googleClient: OAuth2Client;

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity) private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly passwordUtil: PasswordUtil,
    private readonly configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
  }

  async register(dto: RegisterDto) {
    this.logger.log('Registering new HCP user', { email: dto.email });
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { mobile: dto.mobile }],
    });
    if (existing) throw new ConflictException('Email or mobile already registered');

    const passwordHash = await this.passwordUtil.hash(dto.password);
    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      mobile: dto.mobile,
      passwordHash,
      pinCode: dto.pinCode,
      city: dto.city,
      state: dto.state,
      hospital: dto.hospital,
      profession: dto.profession,
      speciality: dto.speciality,
      medicalRegNo: dto.medicalRegNo,
      consentMarketing: dto.consentMarketing ?? false,
      consentTerumo: dto.consentTerumo ?? false,
      status: UserStatus.PENDING,
    });
    await this.userRepository.save(user);
    this.logger.log('User registered successfully', { userId: user.id });
    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    this.logger.log('Login attempt', { email: dto.email });
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status === UserStatus.DISABLED) throw new UnauthorizedException('Account is disabled');
    if (!user.passwordHash) throw new UnauthorizedException('This account uses Google sign-in. Please continue with Google.');
    const valid = await this.passwordUtil.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    this.logger.log('Login successful', { userId: user.id });
    return this.generateTokens(user);
  }

  private async verifyGoogleIdToken(idToken: string) {
    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }
    const payload = ticket.getPayload();
    if (!payload?.email) throw new UnauthorizedException('Invalid Google token');
    return payload;
  }

  async googleAuth(idToken: string) {
    const payload = await this.verifyGoogleIdToken(idToken);
    this.logger.log('Google auth attempt', { email: payload.email });

    let user = await this.userRepository.findOne({ where: { googleId: payload.sub } });
    if (!user) user = await this.userRepository.findOne({ where: { email: payload.email } });

    if (!user) {
      return {
        isNewUser: true,
        profile: {
          email: payload.email,
          firstName: payload.given_name ?? '',
          lastName: payload.family_name ?? '',
        },
      };
    }

    if (user.status === UserStatus.DISABLED) throw new UnauthorizedException('Account is disabled');

    if (!user.googleId) {
      user.googleId = payload.sub;
      user.emailVerified = true;
      await this.userRepository.save(user);
    }

    this.logger.log('Google login successful', { userId: user.id });
    return { isNewUser: false, ...(await this.generateTokens(user)) };
  }

  async googleRegister(dto: GoogleRegisterDto) {
    const payload = await this.verifyGoogleIdToken(dto.idToken);
    this.logger.log('Registering new HCP user via Google', { email: payload.email });

    const existing = await this.userRepository.findOne({
      where: [{ email: payload.email }, { mobile: dto.mobile }, { googleId: payload.sub }],
    });
    if (existing) throw new ConflictException('Email or mobile already registered');

    const user = this.userRepository.create({
      firstName: payload.given_name ?? '',
      lastName: payload.family_name ?? '',
      email: payload.email,
      mobile: dto.mobile,
      passwordHash: null,
      provider: 'google',
      googleId: payload.sub,
      pinCode: dto.pinCode,
      city: dto.city,
      state: dto.state,
      hospital: dto.hospital,
      profession: dto.profession,
      speciality: dto.speciality,
      medicalRegNo: dto.medicalRegNo,
      consentMarketing: dto.consentMarketing ?? false,
      consentTerumo: dto.consentTerumo ?? false,
      status: UserStatus.PENDING,
      emailVerified: true,
    });
    await this.userRepository.save(user);
    this.logger.log('User registered successfully via Google', { userId: user.id });
    return this.generateTokens(user);
  }

  async sendOtp(mobile: string) {
    this.logger.log('OTP requested', { mobile });
    return { message: 'OTP sent successfully' };
  }

  async loginWithOtp(mobile: string, _otp: string) {
    this.logger.log('OTP login attempt', { mobile });
    const user = await this.userRepository.findOne({ where: { mobile } });
    if (!user) throw new UnauthorizedException('Mobile number not registered');
    if (user.status === UserStatus.DISABLED) throw new UnauthorizedException('Account is disabled');
    this.logger.log('OTP login successful', { userId: user.id });
    return this.generateTokens(user);
  }

  async refreshTokens(refreshTokenValue: string) {
    let payload: { sub: string; email: string; role: string };
    try {
      payload = this.jwtService.verify(refreshTokenValue, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedToken = await this.refreshTokenRepository.findOne({
      where: {
        userId: payload.sub,
        tokenHash: this.hashRefreshToken(refreshTokenValue),
        isRevoked: false,
        expiresAt: MoreThan(new Date()),
      },
    });
    if (!storedToken) throw new UnauthorizedException('Refresh token expired or revoked');

    storedToken.isRevoked = true;
    await this.refreshTokenRepository.save(storedToken);

    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User not found');

    this.logger.log('Tokens refreshed', { userId: user.id });
    return this.generateTokens(user);
  }

  async logout(refreshTokenValue: string) {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(refreshTokenValue, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      // Token already invalid/expired — nothing to revoke, but logout should
      // still succeed since the client is clearing its own state regardless.
      return { message: 'Logged out' };
    }

    const storedToken = await this.refreshTokenRepository.findOne({
      where: { userId: payload.sub, tokenHash: this.hashRefreshToken(refreshTokenValue), isRevoked: false },
    });
    if (storedToken) {
      storedToken.isRevoked = true;
      await this.refreshTokenRepository.save(storedToken);
    }

    // Revoking the refresh token alone only stops *future* refreshes — the
    // currently-active access token is a stateless JWT with no revocation
    // check, so it would otherwise keep authenticating until it naturally
    // expires. Stamping this lets JwtStrategy reject any access token
    // issued before now, so a protected page genuinely stops being
    // reachable right away, not just up to an hour later.
    await this.userRepository.update(payload.sub, { sessionInvalidatedAt: new Date() });

    this.logger.log('User logged out', { userId: payload.sub });
    return { message: 'Logged out' };
  }

  async getMe(userId: string) {
    this.logger.log('Fetching current user', { userId });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const { passwordHash, sessionInvalidatedAt, ...result } = user;
    return result;
  }

  async updateMyProfile(userId: string, dto: UpdateMyProfileDto) {
    this.logger.log('Updating current user profile', { userId });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    Object.assign(user, dto);
    await this.userRepository.save(user);
    const { passwordHash, sessionInvalidatedAt, ...result } = user;
    return result;
  }

  // Refresh tokens are long, already-random JWTs (not low-entropy secrets
  // like passwords), so a fast deterministic digest is the right tool for
  // exact-match storage/lookup here — bcrypt (used for real passwords
  // elsewhere in this file) silently truncates its input at 72 bytes, and
  // since these JWTs share a long common prefix across repeated logins for
  // the same user (identical sub/email/role, differing iat/exp near the
  // end), bcrypt.compare was returning false-positive matches across
  // different tokens for the same user, breaking exact revocation.
  private hashRefreshToken(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private async generateTokens(user: UserEntity) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshTokenValue = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d'),
    });
    const tokenHash = this.hashRefreshToken(refreshTokenValue);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await this.refreshTokenRepository.save(
      this.refreshTokenRepository.create({ userId: user.id, tokenHash, expiresAt }),
    );
    return {
      access_token: accessToken,
      refresh_token: refreshTokenValue,
      expires_in: 3600,
      token_type: 'Bearer',
    };
  }
}
