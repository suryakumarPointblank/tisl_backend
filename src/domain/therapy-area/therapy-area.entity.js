import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SubSectionEntity } from '../sub-section/sub-section.entity.js';

@Entity('therapy_areas')
export class TherapyAreaEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', unique: true })
  code;

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

  @OneToMany(() => SubSectionEntity, (s) => s.therapyArea)
  subSections;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
