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
import { SubSectionEntity } from '../sub-section/sub-section.entity';
import { ContentItemEntity } from '../content-item/content-item.entity';

@Entity('topics')
export class TopicEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'sub_section_id', type: 'uuid' })
  @Index()
  subSectionId: string;

  @ManyToOne(() => SubSectionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sub_section_id' })
  subSection: SubSectionEntity;

  @Column({ type: 'varchar' }) name: string;
  @Column({ type: 'varchar' }) slug: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ name: 'order_index', type: 'int', default: 0 }) orderIndex: number;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;

  @OneToMany(() => ContentItemEntity, (c) => c.topic) contentItems: ContentItemEntity[];

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
