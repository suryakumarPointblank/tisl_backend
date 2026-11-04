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

  // Added after 17 rows already existed without it - default lets existing
  // rows pass the NOT NULL constraint; new submissions always fill it in,
  // enforced by CreateHcpConsentDto and the form itself.
  @Column({ name: 'hospital_name', type: 'varchar', default: '' })
  hospitalName: string;

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
