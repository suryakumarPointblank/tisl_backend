import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { SubSectionEntity } from '../sub-section/sub-section.entity';

@Entity('therapy_areas')
export class TherapyAreaEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'varchar', unique: true }) code: string;
  @Column({ type: 'varchar' }) name: string;
  @Column({ type: 'varchar', unique: true }) slug: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ name: 'icon_url', type: 'varchar', nullable: true }) iconUrl: string;
  @Column({ name: 'order_index', type: 'int', default: 0 }) orderIndex: number;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;
  @OneToMany(() => SubSectionEntity, (s) => s.therapyArea) subSections: SubSectionEntity[];
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
