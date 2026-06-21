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
import { SubSectionEntity } from '../sub-section/sub-section.entity.js';
import { ContentItemEntity } from '../content-item/content-item.entity.js';

@Entity('topics')
export class TopicEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ name: 'sub_section_id', type: 'uuid' })
  @Index()
  subSectionId;

  @ManyToOne(() => SubSectionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sub_section_id' })
  subSection;

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

  @OneToMany(() => ContentItemEntity, (c) => c.topic)
  contentItems;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
