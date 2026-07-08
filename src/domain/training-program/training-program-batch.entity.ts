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
import { TrainingProgramEntity } from './training-program.entity';

@Entity('training_program_batches')
export class TrainingProgramBatchEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'program_id', type: 'uuid' })
  @Index()
  programId: string;

  @ManyToOne(() => TrainingProgramEntity, (program) => program.batches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'program_id' })
  program: TrainingProgramEntity;

  @Column({ name: 'batch_number', type: 'int' }) batchNumber: number;
  @Column({ name: 'start_date', type: 'date' }) startDate: string;
  @Column({ name: 'end_date', type: 'date' }) endDate: string;
  @Column({ type: 'varchar', nullable: true }) venue: string;
  @Column({ type: 'varchar', nullable: true }) city: string;
  @Column({ name: 'seats_total', type: 'int', default: 8 }) seatsTotal: number;
  @Column({ name: 'seats_available', type: 'int', default: 8 }) seatsAvailable: number;
  @Column({ type: 'varchar', default: 'OPEN' }) status: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
