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
import { ConditionEntity } from '../condition/condition.entity';

export const JourneyStage = {
  KNOW_CONDITION: 'KNOW_CONDITION',
  KNOW_PROCEDURE: 'KNOW_PROCEDURE',
  PREPARING: 'PREPARING',
  PROCEDURE_DAY: 'PROCEDURE_DAY',
  RECOVERY: 'RECOVERY',
} as const;

export const PatientContentType = {
  AWARENESS_VIDEO: 'AWARENESS_VIDEO',
  FAQ: 'FAQ',
  CAREGIVER_TIPS: 'CAREGIVER_TIPS',
  PATIENT_STORY: 'PATIENT_STORY',
  MYTHS_FACTS: 'MYTHS_FACTS',
  DOWNLOAD_PDF: 'DOWNLOAD_PDF',
} as const;

@Entity('patient_content')
export class PatientContentEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'condition_id', type: 'uuid' })
  @Index()
  conditionId: string;

  @ManyToOne(() => ConditionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'condition_id' })
  condition: ConditionEntity;

  @Column({ name: 'journey_stage', type: 'varchar' }) journeyStage: string;
  @Column({ name: 'content_type', type: 'varchar' }) contentType: string;
  @Column({ type: 'varchar' }) title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ name: 'file_url', type: 'text', nullable: true }) fileUrl: string;
  @Column({ name: 'thumbnail_url', type: 'text', nullable: true }) thumbnailUrl: string;
  @Column({ name: 'content_data', type: 'jsonb', nullable: true }) contentData: Record<string, unknown>;
  @Column({ name: 'order_index', type: 'int', default: 0 }) orderIndex: number;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
