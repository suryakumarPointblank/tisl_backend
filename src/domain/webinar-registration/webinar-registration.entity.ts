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
import { WebinarEntity } from '../webinar/webinar.entity';

@Entity('webinar_registrations')
export class WebinarRegistrationEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'webinar_id', type: 'uuid' })
  @Index()
  webinarId: string;

  @ManyToOne(() => WebinarEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'webinar_id' })
  webinar: WebinarEntity;

  @Column({ name: 'first_name', type: 'varchar' }) firstName: string;
  @Column({ name: 'last_name', type: 'varchar' }) lastName: string;
  @Column({ type: 'varchar', nullable: true }) mobile: string;
  @Column({ type: 'varchar', nullable: true }) email: string;
  @Column({ type: 'varchar', nullable: true }) hospital: string;
  @Column({ type: 'varchar', nullable: true }) speciality: string;
  @Column({ name: 'attend_preference', type: 'varchar', nullable: true }) attendPreference: string;
  @Column({ name: 'consent_reminder', type: 'boolean', default: false }) consentReminder: boolean;
  @Column({ name: 'consent_recording', type: 'boolean', default: false }) consentRecording: boolean;
  @Column({ name: 'consent_terumo', type: 'boolean', default: false }) consentTerumo: boolean;
  @Column({ type: 'varchar', default: 'REGISTERED' }) status: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
