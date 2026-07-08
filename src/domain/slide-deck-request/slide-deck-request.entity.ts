import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('slide_deck_requests')
export class SlideDeckRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  speciality: string | null;

  @Column({ name: 'content_item_id', type: 'uuid', nullable: true })
  contentItemId: string | null;

  @Column({ name: 'is_hcp_confirmed', type: 'boolean', default: false })
  isHcpConfirmed: boolean;

  @Column({ name: 'is_consent_given', type: 'boolean', default: false })
  isConsentGiven: boolean;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
