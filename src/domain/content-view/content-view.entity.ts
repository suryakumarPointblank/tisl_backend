import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { TherapyAreaEntity } from '../therapy-area/therapy-area.entity';
import { ContentItemEntity } from '../content-item/content-item.entity';

@Entity('content_views')
export class ContentViewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'therapy_area_id', type: 'uuid' })
  @Index()
  therapyAreaId: string;

  @ManyToOne(() => TherapyAreaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'therapy_area_id' })
  therapyArea: TherapyAreaEntity;

  @Column({ name: 'content_item_id', type: 'uuid' })
  @Index()
  contentItemId: string;

  @ManyToOne(() => ContentItemEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_item_id' })
  contentItem: ContentItemEntity;

  @Column({ name: 'session_id', type: 'varchar', nullable: true })
  @Index()
  sessionId: string;

  @CreateDateColumn({ name: 'viewed_at' })
  viewedAt: Date;
}
