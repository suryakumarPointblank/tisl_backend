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
import { TherapyAreaEntity } from '../therapy-area/therapy-area.entity';
import { TopicEntity } from '../topic/topic.entity';

@Entity('sub_sections')
export class SubSectionEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'therapy_area_id', type: 'uuid' })
  @Index()
  therapyAreaId: string;

  @ManyToOne(() => TherapyAreaEntity, (ta) => ta.subSections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'therapy_area_id' })
  therapyArea: TherapyAreaEntity;

  @Column({ type: 'varchar' }) name: string;
  @Column({ type: 'varchar' }) slug: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ name: 'order_index', type: 'int', default: 0 }) orderIndex: number;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;

  @OneToMany(() => TopicEntity, (t) => t.subSection) topics: TopicEntity[];

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
