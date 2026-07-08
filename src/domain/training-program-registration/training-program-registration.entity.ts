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
import { UserEntity } from '../user/user.entity';
import { TrainingProgramEntity } from '../training-program/training-program.entity';
import { TrainingProgramBatchEntity } from '../training-program/training-program-batch.entity';

@Entity('training_program_registrations')
export class TrainingProgramRegistrationEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'program_id', type: 'uuid' })
  @Index()
  programId: string;

  @ManyToOne(() => TrainingProgramEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'program_id' })
  program: TrainingProgramEntity;

  @Column({ name: 'batch_id', type: 'uuid' })
  @Index()
  batchId: string;

  @ManyToOne(() => TrainingProgramBatchEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_id' })
  batch: TrainingProgramBatchEntity;

  @Column({ name: 'first_name', type: 'varchar' }) firstName: string;
  @Column({ name: 'last_name', type: 'varchar' }) lastName: string;
  @Column({ type: 'varchar', nullable: true }) mobile: string;
  @Column({ type: 'varchar' }) email: string;
  @Column({ type: 'varchar', nullable: true }) hospital: string;
  @Column({ type: 'varchar', nullable: true }) city: string;
  @Column({ name: 'medical_reg_no', type: 'varchar', nullable: true }) medicalRegNo: string;
  @Column({ type: 'varchar', nullable: true }) designation: string;
  @Column({ name: 'needs_airport_transfer', type: 'boolean', default: false }) needsAirportTransfer: boolean;
  @Column({ type: 'varchar', default: 'PENDING' }) status: string;
  @Column({ name: 'registration_ref', type: 'varchar', nullable: true }) registrationRef: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
