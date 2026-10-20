import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('hcp_consents')
export class HcpConsentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', nullable: true })
  phoneNumber: string | null;

  @Column({ type: 'boolean' })
  consent: boolean;

  @Column({ name: 'marketing_consent', type: 'boolean', default: false })
  marketingConsent: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
