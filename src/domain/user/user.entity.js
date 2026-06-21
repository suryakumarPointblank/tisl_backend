import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export const UserRole = { HCP: 'HCP', ADMIN: 'ADMIN' };
export const UserStatus = { ACTIVE: 'ACTIVE', PENDING: 'PENDING', DISABLED: 'DISABLED' };

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName;

  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  lastName;

  @Column({ type: 'varchar', unique: true })
  @Index()
  email;

  @Column({ type: 'varchar', unique: true })
  @Index()
  mobile;

  @Column({ name: 'password_hash', type: 'varchar' })
  passwordHash;

  @Column({ name: 'pin_code', type: 'varchar', nullable: true })
  pinCode;

  @Column({ type: 'varchar', nullable: true })
  city;

  @Column({ type: 'varchar', nullable: true })
  state;

  @Column({ type: 'varchar', nullable: true })
  hospital;

  @Column({ type: 'varchar', nullable: true })
  profession;

  @Column({ type: 'varchar', nullable: true })
  speciality;

  @Column({ name: 'practicing_since', type: 'date', nullable: true })
  practicingSince;

  @Column({ name: 'medical_reg_no', type: 'varchar', nullable: true })
  medicalRegNo;

  @Column({ name: 'medical_reg_year', type: 'int', nullable: true })
  medicalRegYear;

  @Column({ type: 'varchar', default: UserRole.HCP })
  role;

  @Column({ type: 'varchar', default: UserStatus.PENDING })
  status;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified;

  @Column({ name: 'mobile_verified', type: 'boolean', default: false })
  mobileVerified;

  @Column({ name: 'consent_marketing', type: 'boolean', default: false })
  consentMarketing;

  @Column({ name: 'consent_terumo', type: 'boolean', default: false })
  consentTerumo;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
