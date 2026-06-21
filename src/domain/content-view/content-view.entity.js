import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../user/user.entity.js';
import { TherapyAreaEntity } from '../therapy-area/therapy-area.entity.js';
import { ContentItemEntity } from '../content-item/content-item.entity.js';

@Entity('content_views')
export class ContentViewEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  @Index()
  userId;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user;

  @Column({ name: 'therapy_area_id', type: 'uuid' })
  @Index()
  therapyAreaId;

  @ManyToOne(() => TherapyAreaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'therapy_area_id' })
  therapyArea;

  @Column({ name: 'content_item_id', type: 'uuid' })
  @Index()
  contentItemId;

  @ManyToOne(() => ContentItemEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_item_id' })
  contentItem;

  @Column({ name: 'session_id', type: 'varchar', nullable: true })
  @Index()
  sessionId;

  @CreateDateColumn({ name: 'viewed_at' })
  viewedAt;
}
