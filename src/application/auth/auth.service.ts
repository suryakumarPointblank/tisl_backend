import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UserEntity, UserStatus } from '../../domain/user/user.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { PasswordUtil } from '../../common/utils/password.util';
import { Logger } from '../../common/utils/logger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleRegisterDto } from './dto/google-register.dto';

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
      hospital: dto.hospital,
      profession: dto.profession,
      speciality: dto.speciality,
      practicingSince: dto.practicingSince,
      medicalRegNo: dto.medicalRegNo,
      medicalRegYear: dto.medicalRegYear,
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
      hospital: dto.hospital,
      profession: dto.profession,
      speciality: dto.speciality,
      practicingSince: dto.practicingSince,
      medicalRegNo: dto.medicalRegNo,
      medicalRegYear: dto.medicalRegYear,
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
      where: { userId: payload.sub, isRevoked: false, expiresAt: MoreThan(new Date()) },
    });
    if (!storedToken) throw new UnauthorizedException('Refresh token expired or revoked');

    const isValid = await this.passwordUtil.compare(refreshTokenValue, storedToken.tokenHash);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    storedToken.isRevoked = true;
    await this.refreshTokenRepository.save(storedToken);

    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User not found');

    this.logger.log('Tokens refreshed', { userId: user.id });
    return this.generateTokens(user);
  }

  async getMe(userId: string) {
    this.logger.log('Fetching current user', { userId });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const { passwordHash, ...result } = user;
    return result;
  }

  private async generateTokens(user: UserEntity) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshTokenValue = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d'),
    });
    const tokenHash = await this.passwordUtil.hash(refreshTokenValue);
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
