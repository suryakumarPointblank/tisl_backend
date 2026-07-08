import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('case_submissions')
export class CaseSubmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ name: 'therapy_area', type: 'varchar' })
  therapyArea: string;

  @Column({ type: 'varchar', nullable: true })
  topic: string | null;

  @Column({ name: 'patient_age', type: 'varchar', nullable: true })
  patientAge: string | null;

  @Column({ name: 'patient_sex', type: 'varchar', nullable: true })
  patientSex: string | null;

  @Column({ type: 'text', nullable: true })
  comorbidities: string | null;

  @Column({ name: 'clinical_challenge', type: 'varchar', nullable: true })
  clinicalChallenge: string | null;

  @Column({ name: 'learning_point', type: 'text', nullable: true })
  learningPoint: string | null;

  @Column({ name: 'submitter_name', type: 'varchar' })
  submitterName: string;

  @Column({ name: 'submitter_email', type: 'varchar' })
  submitterEmail: string;

  @Column({ name: 'submitter_institution', type: 'varchar', nullable: true })
  submitterInstitution: string | null;

  @Column({ name: 'submitter_city', type: 'varchar', nullable: true })
  submitterCity: string | null;

  @Column({ type: 'varchar', nullable: true })
  attribution: string | null;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
