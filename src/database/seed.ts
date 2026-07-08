import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { TrainingProgramEntity } from '../domain/training-program/training-program.entity';
import { TrainingProgramBatchEntity } from '../domain/training-program/training-program-batch.entity';
import { FacultyEntity } from '../domain/faculty/faculty.entity';
import { WebinarEntity } from '../domain/webinar/webinar.entity';
import { TherapyAreaEntity } from '../domain/therapy-area/therapy-area.entity';
import { UserEntity } from '../domain/user/user.entity';
import { WebinarRegistrationEntity } from '../domain/webinar-registration/webinar-registration.entity';
import { TrainingProgramRegistrationEntity } from '../domain/training-program-registration/training-program-registration.entity';
import { SubSectionEntity } from '../domain/sub-section/sub-section.entity';
import { TopicEntity } from '../domain/topic/topic.entity';
import { ContentItemEntity } from '../domain/content-item/content-item.entity';
import { ContentViewEntity } from '../domain/content-view/content-view.entity';
import { ContentLikeEntity } from '../domain/content-like/content-like.entity';
import { ConditionEntity } from '../domain/condition/condition.entity';
import { PatientContentEntity } from '../domain/patient-content/patient-content.entity';
import { RefreshTokenEntity } from '../application/auth/refresh-token.entity';
import { ContactInquiryEntity } from '../domain/contact-inquiry/contact-inquiry.entity';
import { CaseSubmissionEntity } from '../domain/case-submission/case-submission.entity';
import { SlideDeckRequestEntity } from '../domain/slide-deck-request/slide-deck-request.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tisl',
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
  ],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const programRepo = AppDataSource.getRepository(TrainingProgramEntity);
  const batchRepo = AppDataSource.getRepository(TrainingProgramBatchEntity);

  const existingCount = await programRepo.count();
  if (existingCount === 0) {
    const programs = [
      {
        title: 'PCI Masters Program',
        slug: 'pci-masters-program',
        description:
          'An immersive 2.5-day hands-on programme for interventional cardiologists seeking to advance procedural technique across complex PCI scenarios — bifurcation, CTO, high-bleeding risk, and left main interventions. Small-group format with live-case observation and skills lab simulation.',
        therapyArea: 'Interventional Cardiology',
        programType: 'PCI',
        durationDays: 2.5,
        format: '2.5 days · hands-on',
        maxParticipants: 8,
        whatItCovers: JSON.stringify([
          { title: 'Live case observation', detail: 'Observe complex PCI cases in our partner cath lab with expert commentary.' },
          { title: 'Skills lab simulation', detail: 'Hands-on wire handling, guide catheter technique, and bifurcation simulation.' },
          { title: 'Small group format', detail: 'Maximum 8 participants per batch for faculty interaction and individual feedback.' },
          { title: 'Certificate of completion', detail: 'TISL certificate issued on successful completion of all sessions.' },
        ]),
        designedFor:
          'Interventional cardiologists performing 50–150 PCIs annually who want to advance technique in complex anatomy scenarios. Not suitable for trainees or fellows without prior PCI experience.',
        whatsIncluded: JSON.stringify(['Course handbook and reference materials', 'TISL Certificate of completion']),
        isActive: true,
      },
      {
        title: 'CTO Masterclass',
        slug: 'cto-masterclass',
        description:
          'A focused 2-day programme on chronic total occlusion (CTO) PCI techniques. Covers retrograde approach, collateral channel selection, wire management, and device strategies for complex CTO anatomy.',
        therapyArea: 'Interventional Cardiology',
        programType: 'CTO',
        durationDays: 2,
        format: '2 days · case-based learning',
        maxParticipants: 8,
        whatItCovers: JSON.stringify([
          { title: 'Anterograde techniques', detail: 'Wire escalation, CART, and knuckle wire techniques.' },
          { title: 'Retrograde approach', detail: 'Collateral channel selection, retrograde wire manipulation.' },
          { title: 'Device selection', detail: 'Choosing the right microcatheter, OTW balloon, and stent strategy.' },
          { title: 'Live case observation', detail: 'Real-time observation in partner cath lab with faculty commentary.' },
        ]),
        designedFor:
          'Experienced interventional cardiologists looking to develop or refine CTO PCI capabilities. Requires prior basic CTO experience.',
        whatsIncluded: JSON.stringify(['CTO case library access (90 days)', 'TISL Certificate of completion']),
        isActive: true,
      },
      {
        title: 'Interventional Radiology Fundamentals',
        slug: 'ir-fundamentals',
        description:
          'A 3-day comprehensive programme covering core IR procedures — peripheral vascular, oncological embolisation, and vascular access. Structured for radiologists transitioning to interventional practice.',
        therapyArea: 'Interventional Radiology',
        programType: 'IR',
        durationDays: 3,
        format: '3 days · lectures + simulation',
        maxParticipants: 10,
        whatItCovers: JSON.stringify([
          { title: 'Peripheral vascular interventions', detail: 'Angioplasty, stenting, and thrombectomy techniques for PAD.' },
          { title: 'Oncological procedures', detail: 'TACE, Y90, microwave ablation, and tumour embolisation.' },
          { title: 'Vascular access', detail: 'PICC, ports, tunnelled lines, and dialysis access management.' },
          { title: 'Simulation lab', detail: 'Hands-on fluoroscopy phantom training.' },
        ]),
        designedFor:
          'Radiologists with 2+ years post-fellowship experience looking to formalise interventional training.',
        whatsIncluded: JSON.stringify(['Simulation lab access', 'Course handbook', 'TISL Certificate of completion']),
        isActive: true,
      },
    ];

    for (const prog of programs) {
      const saved = await programRepo.save(programRepo.create(prog));
      console.log(`Created program: ${saved.title}`);

      if (saved.slug === 'pci-masters-program') {
        const batches = [
          { programId: saved.id, batchNumber: 5, startDate: '2026-05-12', endDate: '2026-05-14', venue: 'TISL Training Centre', city: 'Gurugram', seatsTotal: 8, seatsAvailable: 0, status: 'FULLY_BOOKED' },
          { programId: saved.id, batchNumber: 6, startDate: '2026-06-12', endDate: '2026-06-14', venue: 'TISL Training Centre', city: 'Gurugram', seatsTotal: 8, seatsAvailable: 3, status: 'OPEN' },
          { programId: saved.id, batchNumber: 7, startDate: '2026-08-12', endDate: '2026-08-14', venue: 'TISL Training Centre', city: 'Gurugram', seatsTotal: 8, seatsAvailable: 2, status: 'OPEN' },
        ];
        for (const batch of batches) {
          await batchRepo.save(batchRepo.create(batch));
        }
      }

      if (saved.slug === 'cto-masterclass') {
        const batches = [
          { programId: saved.id, batchNumber: 1, startDate: '2026-07-08', endDate: '2026-07-09', venue: 'Apollo Hospitals', city: 'Chennai', seatsTotal: 8, seatsAvailable: 5, status: 'OPEN' },
          { programId: saved.id, batchNumber: 2, startDate: '2026-09-15', endDate: '2026-09-16', venue: 'TISL Training Centre', city: 'Gurugram', seatsTotal: 8, seatsAvailable: 8, status: 'OPEN' },
        ];
        for (const batch of batches) {
          await batchRepo.save(batchRepo.create(batch));
        }
      }

      if (saved.slug === 'ir-fundamentals') {
        const batches = [
          { programId: saved.id, batchNumber: 1, startDate: '2026-08-04', endDate: '2026-08-06', venue: 'Fortis Hospital', city: 'Mumbai', seatsTotal: 10, seatsAvailable: 7, status: 'OPEN' },
        ];
        for (const batch of batches) {
          await batchRepo.save(batchRepo.create(batch));
        }
      }
    }

    console.log('Training programs seeded successfully');
  } else {
    console.log('Training programs already exist, skipping');
  }

  await AppDataSource.destroy();
  console.log('Done');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
