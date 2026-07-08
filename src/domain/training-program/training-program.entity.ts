import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { TrainingProgramBatchEntity } from './training-program-batch.entity';

@Entity('training_programs')
export class TrainingProgramEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'varchar' }) title: string;

  @Column({ type: 'varchar', unique: true })
  @Index()
  slug: string;

  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ name: 'therapy_area', type: 'varchar', nullable: true }) therapyArea: string;
  @Column({ name: 'program_type', type: 'varchar', nullable: true }) programType: string;
  @Column({ name: 'duration_days', type: 'float', nullable: true }) durationDays: number;
  @Column({ type: 'varchar', nullable: true }) format: string;
  @Column({ name: 'max_participants', type: 'int', nullable: true }) maxParticipants: number;
  @Column({ name: 'what_it_covers', type: 'text', nullable: true }) whatItCovers: string;
  @Column({ name: 'designed_for', type: 'text', nullable: true }) designedFor: string;
  @Column({ name: 'whats_included', type: 'text', nullable: true }) whatsIncluded: string;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;

  @OneToMany(() => TrainingProgramBatchEntity, (batch) => batch.program)
  batches: TrainingProgramBatchEntity[];

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
