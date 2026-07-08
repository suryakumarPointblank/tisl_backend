import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './application/auth/auth.module';
import { TherapyAreaModule } from './domain/therapy-area/therapy-area.module';
import { SubSectionModule } from './domain/sub-section/sub-section.module';
import { TopicModule } from './domain/topic/topic.module';
import { ContentItemModule } from './domain/content-item/content-item.module';
import { ContentLikeModule } from './domain/content-like/content-like.module';
import { FacultyModule } from './domain/faculty/faculty.module';
import { ConditionModule } from './domain/condition/condition.module';
import { PatientContentModule } from './domain/patient-content/patient-content.module';
import { WebinarModule } from './domain/webinar/webinar.module';
import { UserModule } from './domain/user/user.module';
import { ContactInquiryModule } from './domain/contact-inquiry/contact-inquiry.module';
import { CaseSubmissionModule } from './domain/case-submission/case-submission.module';
import { SlideDeckRequestModule } from './domain/slide-deck-request/slide-deck-request.module';
import { WebinarRegistrationModule } from './domain/webinar-registration/webinar-registration.module';
import { TrainingProgramModule } from './domain/training-program/training-program.module';
import { TrainingProgramRegistrationModule } from './domain/training-program-registration/training-program-registration.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    TherapyAreaModule,
    SubSectionModule,
    TopicModule,
    ContentItemModule,
    ContentLikeModule,
    FacultyModule,
    ConditionModule,
    PatientContentModule,
    WebinarModule,
    UserModule,
    ContactInquiryModule,
    CaseSubmissionModule,
    SlideDeckRequestModule,
    WebinarRegistrationModule,
    TrainingProgramModule,
    TrainingProgramRegistrationModule,
  ],
})
export class AppModule {}
