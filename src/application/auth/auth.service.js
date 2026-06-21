import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity, UserStatus } from '../../domain/user/user.entity.js';
import { RefreshTokenEntity } from './refresh-token.entity.js';
import { PasswordUtil } from '../../common/utils/password.util.js';
import { Logger } from '../../common/utils/logger.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) userRepository,
    @InjectRepository(RefreshTokenEntity) refreshTokenRepository,
    @Inject(JwtService) jwtService,
    @Inject(PasswordUtil) passwordUtil,
    @Inject(ConfigService) configService,
  ) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.jwtService = jwtService;
    this.passwordUtil = passwordUtil;
    this.configService = configService;
    this.logger = new Logger('AuthService');
  }

  async register(dto) {
    this.logger.log('Registering new HCP user', { email: dto.email });
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { mobile: dto.mobile }],
    });
    if (existing) {
      throw new ConflictException('Email or mobile already registered');
    }
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
      consentMarketing: dto.consentMarketing || false,
      consentTerumo: dto.consentTerumo || false,
      status: UserStatus.PENDING,
    });
    await this.userRepository.save(user);
    this.logger.log('User registered successfully', { userId: user.id });
    return this.generateTokens(user);
  }

  async login(dto) {
    this.logger.log('Login attempt', { email: dto.email });
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status === UserStatus.DISABLED) throw new UnauthorizedException('Account is disabled');
    const valid = await this.passwordUtil.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    this.logger.log('Login successful', { userId: user.id });
    return this.generateTokens(user);
  }

  async sendOtp(mobile) {
    this.logger.log('OTP requested', { mobile });
    // Integrate SMS provider here (e.g. Twilio, MSG91)
    return { message: 'OTP sent successfully' };
  }

  async loginWithOtp(mobile, otp) {
    this.logger.log('OTP login attempt', { mobile });
    // Integrate SMS provider here to validate OTP
    const user = await this.userRepository.findOne({ where: { mobile } });
    if (!user) throw new UnauthorizedException('Mobile number not registered');
    if (user.status === UserStatus.DISABLED) throw new UnauthorizedException('Account is disabled');
    this.logger.log('OTP login successful', { userId: user.id });
    return this.generateTokens(user);
  }

  async refreshTokens(refreshTokenValue) {
    let payload;
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

  async getMe(userId) {
    this.logger.log('Fetching current user', { userId });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const { passwordHash, ...result } = user;
    return result;
  }

  async generateTokens(user) {
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
