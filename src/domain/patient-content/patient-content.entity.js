import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ConditionEntity } from '../condition/condition.entity.js';

export const JourneyStage = {
  KNOW_CONDITION: 'KNOW_CONDITION',
  KNOW_PROCEDURE: 'KNOW_PROCEDURE',
  PREPARING: 'PREPARING',
  PROCEDURE_DAY: 'PROCEDURE_DAY',
  RECOVERY: 'RECOVERY',
};

export const PatientContentType = {
  AWARENESS_VIDEO: 'AWARENESS_VIDEO',
  FAQ: 'FAQ',
  CAREGIVER_TIPS: 'CAREGIVER_TIPS',
  PATIENT_STORY: 'PATIENT_STORY',
  MYTHS_FACTS: 'MYTHS_FACTS',
  DOWNLOAD_PDF: 'DOWNLOAD_PDF',
};

@Entity('patient_content')
export class PatientContentEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ name: 'condition_id', type: 'uuid' })
  @Index()
  conditionId;

  @ManyToOne(() => ConditionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'condition_id' })
  condition;

  @Column({ name: 'journey_stage', type: 'varchar' })
  journeyStage;

  @Column({ name: 'content_type', type: 'varchar' })
  contentType;

  @Column({ type: 'varchar' })
  title;

  @Column({ type: 'text', nullable: true })
  description;

  @Column({ name: 'file_url', type: 'text', nullable: true })
  fileUrl;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl;

  @Column({ name: 'content_data', type: 'jsonb', nullable: true })
  contentData;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
