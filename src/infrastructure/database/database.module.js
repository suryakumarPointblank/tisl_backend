import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from '../../domain/user/user.entity.js';
import { FacultyEntity } from '../../domain/faculty/faculty.entity.js';
import { TherapyAreaEntity } from '../../domain/therapy-area/therapy-area.entity.js';
import { SubSectionEntity } from '../../domain/sub-section/sub-section.entity.js';
import { TopicEntity } from '../../domain/topic/topic.entity.js';
import { ContentItemEntity } from '../../domain/content-item/content-item.entity.js';
import { ContentViewEntity } from '../../domain/content-view/content-view.entity.js';
import { ContentLikeEntity } from '../../domain/content-like/content-like.entity.js';
import { ConditionEntity } from '../../domain/condition/condition.entity.js';
import { PatientContentEntity } from '../../domain/patient-content/patient-content.entity.js';
import { WebinarEntity } from '../../domain/webinar/webinar.entity.js';
import { RefreshTokenEntity } from '../../application/auth/refresh-token.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          UserEntity,
          RefreshTokenEntity,
          FacultyEntity,
          TherapyAreaEntity,
          SubSectionEntity,
          TopicEntity,
          ContentItemEntity,
          ContentViewEntity,
          ContentLikeEntity,
          ConditionEntity,
          PatientContentEntity,
          WebinarEntity,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {}
