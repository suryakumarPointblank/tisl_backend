import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PatientContentEntity } from '../patient-content/patient-content.entity.js';

@Entity('conditions')
export class ConditionEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  name;

  @Column({ type: 'varchar', unique: true })
  slug;

  @Column({ type: 'text', nullable: true })
  description;

  @Column({ name: 'icon_url', type: 'varchar', nullable: true })
  iconUrl;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive;

  @OneToMany(() => PatientContentEntity, (p) => p.condition)
  patientContent;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
