import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

export const UserRole = { HCP: 'HCP', ADMIN: 'ADMIN' } as const;
export const UserStatus = { ACTIVE: 'ACTIVE', PENDING: 'PENDING', DISABLED: 'DISABLED' } as const;

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'first_name', type: 'varchar' }) firstName: string;
  @Column({ name: 'last_name', type: 'varchar', nullable: true }) lastName: string;
  @Column({ type: 'varchar', unique: true }) @Index() email: string;
  @Column({ type: 'varchar', unique: true }) @Index() mobile: string;
  @Column({ name: 'password_hash', type: 'varchar' }) passwordHash: string;
  @Column({ name: 'pin_code', type: 'varchar', nullable: true }) pinCode: string;
  @Column({ type: 'varchar', nullable: true }) city: string;
  @Column({ type: 'varchar', nullable: true }) state: string;
  @Column({ type: 'varchar', nullable: true }) hospital: string;
  @Column({ type: 'varchar', nullable: true }) profession: string;
  @Column({ type: 'varchar', nullable: true }) speciality: string;
  @Column({ name: 'practicing_since', type: 'date', nullable: true }) practicingSince: string;
  @Column({ name: 'medical_reg_no', type: 'varchar', nullable: true }) medicalRegNo: string;
  @Column({ name: 'medical_reg_year', type: 'int', nullable: true }) medicalRegYear: number;
  @Column({ type: 'varchar', default: UserRole.HCP }) role: string;
  @Column({ type: 'varchar', default: UserStatus.PENDING }) status: string;
  @Column({ name: 'email_verified', type: 'boolean', default: false }) emailVerified: boolean;
  @Column({ name: 'mobile_verified', type: 'boolean', default: false }) mobileVerified: boolean;
  @Column({ name: 'consent_marketing', type: 'boolean', default: false }) consentMarketing: boolean;
  @Column({ name: 'consent_terumo', type: 'boolean', default: false }) consentTerumo: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
