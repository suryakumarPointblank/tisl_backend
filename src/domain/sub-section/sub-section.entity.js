import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { TherapyAreaEntity } from '../therapy-area/therapy-area.entity.js';
import { TopicEntity } from '../topic/topic.entity.js';

@Entity('sub_sections')
export class SubSectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ name: 'therapy_area_id', type: 'uuid' })
  @Index()
  therapyAreaId;

  @ManyToOne(() => TherapyAreaEntity, (ta) => ta.subSections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'therapy_area_id' })
  therapyArea;

  @Column({ type: 'varchar' })
  name;

  @Column({ type: 'varchar' })
  slug;

  @Column({ type: 'text', nullable: true })
  description;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive;

  @OneToMany(() => TopicEntity, (t) => t.subSection)
  topics;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
