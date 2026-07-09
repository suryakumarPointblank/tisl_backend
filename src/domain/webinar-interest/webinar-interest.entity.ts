import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('webinar_interests')
export class WebinarInterestEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'first_name', type: 'varchar' }) firstName: string;
  @Column({ name: 'last_name', type: 'varchar' }) lastName: string;
  @Column({ type: 'varchar', nullable: true }) mobile: string | null;
  @Column({ type: 'varchar' }) email: string;
  @Column({ type: 'varchar', nullable: true }) hospital: string | null;
  @Column({ type: 'varchar', nullable: true }) speciality: string | null;
  @Column({ name: 'attend_preference', type: 'varchar', nullable: true }) attendPreference: string | null;
  @Column({ name: 'content_item_id', type: 'uuid', nullable: true }) contentItemId: string | null;
  @Column({ name: 'is_hcp_confirmed', type: 'boolean', default: false }) isHcpConfirmed: boolean;
  @Column({ name: 'consent_reminder', type: 'boolean', default: false }) consentReminder: boolean;
  @Column({ name: 'consent_terumo', type: 'boolean', default: false }) consentTerumo: boolean;
  @Column({ type: 'varchar', default: 'PENDING' }) status: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
