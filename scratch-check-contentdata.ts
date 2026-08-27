import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TherapyAreaEntity } from './src/domain/therapy-area/therapy-area.entity';
import { SubSectionEntity } from './src/domain/sub-section/sub-section.entity';
import { TopicEntity } from './src/domain/topic/topic.entity';
import { ContentItemEntity } from './src/domain/content-item/content-item.entity';
import { UserEntity } from './src/domain/user/user.entity';
import { RefreshTokenEntity } from './src/application/auth/refresh-token.entity';
import { FacultyEntity } from './src/domain/faculty/faculty.entity';
import { ContentViewEntity } from './src/domain/content-view/content-view.entity';
import { ContentLikeEntity } from './src/domain/content-like/content-like.entity';
import { ConditionEntity } from './src/domain/condition/condition.entity';
import { PatientContentEntity } from './src/domain/patient-content/patient-content.entity';
import { WebinarEntity } from './src/domain/webinar/webinar.entity';
import { ContactInquiryEntity } from './src/domain/contact-inquiry/contact-inquiry.entity';
import { CaseSubmissionEntity } from './src/domain/case-submission/case-submission.entity';
import { SlideDeckRequestEntity } from './src/domain/slide-deck-request/slide-deck-request.entity';
import { WebinarRegistrationEntity } from './src/domain/webinar-registration/webinar-registration.entity';
import { TrainingProgramEntity } from './src/domain/training-program/training-program.entity';
import { TrainingProgramBatchEntity } from './src/domain/training-program/training-program-batch.entity';
import { TrainingProgramRegistrationEntity } from './src/domain/training-program-registration/training-program-registration.entity';
import { UserFavoriteEntity } from './src/domain/user-favorite/user-favorite.entity';
import { SpecialityEntity } from './src/domain/speciality/speciality.entity';
import { SiteConfigEntity } from './src/domain/site-config/site-config.entity';

async function main() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST_OVERRIDE || 'localhost',
    port: 5432,
    username: 'tisl_admin',
    password: process.env.DB_PASS,
    database: 'tisl_db',
    entities: [
      UserEntity, RefreshTokenEntity, FacultyEntity, TherapyAreaEntity, SubSectionEntity,
      TopicEntity, ContentItemEntity, ContentViewEntity, ContentLikeEntity, ConditionEntity,
      PatientContentEntity, WebinarEntity, ContactInquiryEntity, CaseSubmissionEntity,
      SlideDeckRequestEntity, WebinarRegistrationEntity, TrainingProgramEntity,
      TrainingProgramBatchEntity, TrainingProgramRegistrationEntity, UserFavoriteEntity,
      SpecialityEntity, SiteConfigEntity,
    ],
  });
  await ds.initialize();

  const rows = await ds.query(`SELECT id, title, content_data FROM content_items WHERE content_data IS NOT NULL LIMIT 5`);
  console.log(JSON.stringify(rows, null, 2));

  const keys = await ds.query(`
    SELECT DISTINCT jsonb_object_keys(content_data) as key FROM content_items WHERE content_data IS NOT NULL
  `);
  console.log('Distinct contentData keys:', keys.map((k: any) => k.key));

  await ds.destroy();
}
main().catch((e) => { console.error(e); process.exit(1); });
