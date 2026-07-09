import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from '../../domain/user/user.entity';
import { FacultyEntity } from '../../domain/faculty/faculty.entity';
import { TherapyAreaEntity } from '../../domain/therapy-area/therapy-area.entity';
import { SubSectionEntity } from '../../domain/sub-section/sub-section.entity';
import { TopicEntity } from '../../domain/topic/topic.entity';
import { ContentItemEntity } from '../../domain/content-item/content-item.entity';
import { ContentViewEntity } from '../../domain/content-view/content-view.entity';
import { ContentLikeEntity } from '../../domain/content-like/content-like.entity';
import { ConditionEntity } from '../../domain/condition/condition.entity';
import { PatientContentEntity } from '../../domain/patient-content/patient-content.entity';
import { WebinarEntity } from '../../domain/webinar/webinar.entity';
import { RefreshTokenEntity } from '../../application/auth/refresh-token.entity';
import { ContactInquiryEntity } from '../../domain/contact-inquiry/contact-inquiry.entity';
import { CaseSubmissionEntity } from '../../domain/case-submission/case-submission.entity';
import { SlideDeckRequestEntity } from '../../domain/slide-deck-request/slide-deck-request.entity';
import { WebinarRegistrationEntity } from '../../domain/webinar-registration/webinar-registration.entity';
import { TrainingProgramEntity } from '../../domain/training-program/training-program.entity';
import { TrainingProgramBatchEntity } from '../../domain/training-program/training-program-batch.entity';
import { TrainingProgramRegistrationEntity } from '../../domain/training-program-registration/training-program-registration.entity';
import { UserFavoriteEntity } from '../../domain/user-favorite/user-favorite.entity';
import { SpecialityEntity } from '../../domain/speciality/speciality.entity';
import { SiteConfigEntity } from '../../domain/site-config/site-config.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
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
          ContactInquiryEntity,
          CaseSubmissionEntity,
          SlideDeckRequestEntity,
          WebinarRegistrationEntity,
          TrainingProgramEntity,
          TrainingProgramBatchEntity,
          TrainingProgramRegistrationEntity,
          UserFavoriteEntity,
          SpecialityEntity,
          SiteConfigEntity,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {}
