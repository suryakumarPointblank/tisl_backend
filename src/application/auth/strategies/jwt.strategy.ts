import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../domain/user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; role: string; iat: number }) {
    // Access tokens are otherwise stateless — unrevokable until they
    // naturally expire — so this is what makes logout actually take effect
    // immediately instead of just for future refreshes.
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User not found');
    if (user.sessionInvalidatedAt && payload.iat * 1000 < user.sessionInvalidatedAt.getTime()) {
      throw new UnauthorizedException('Session has been logged out');
    }
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
