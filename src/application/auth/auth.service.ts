import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity, UserStatus } from '../../domain/user/user.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { PasswordUtil } from '../../common/utils/password.util';
import { Logger } from '../../common/utils/logger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity) private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly passwordUtil: PasswordUtil,
    private readonly configService: ConfigService,
  ) {}

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
    const valid = await this.passwordUtil.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    this.logger.log('Login successful', { userId: user.id });
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
