import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { UserEntity } from '../../domain/user/user.entity.js';
import { RefreshTokenEntity } from './refresh-token.entity.js';
import { PasswordUtil } from '../../common/utils/password.util.js';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN', '1h') },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PasswordUtil],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
