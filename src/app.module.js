import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { AuthModule } from './application/auth/auth.module.js';
import { TherapyAreaModule } from './domain/therapy-area/therapy-area.module.js';
import { SubSectionModule } from './domain/sub-section/sub-section.module.js';
import { TopicModule } from './domain/topic/topic.module.js';
import { ContentItemModule } from './domain/content-item/content-item.module.js';
import { ContentLikeModule } from './domain/content-like/content-like.module.js';
import { FacultyModule } from './domain/faculty/faculty.module.js';
import { ConditionModule } from './domain/condition/condition.module.js';
import { PatientContentModule } from './domain/patient-content/patient-content.module.js';
import { WebinarModule } from './domain/webinar/webinar.module.js';

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
  ],
})
export class AppModule {}
