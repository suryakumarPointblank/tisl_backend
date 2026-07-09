import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ContentItemEntity } from '../content-item/content-item.entity';

@Entity('user_favorites')
@Unique(['userId', 'contentItemId'])
export class UserFavoriteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'content_item_id', type: 'uuid' })
  @Index()
  contentItemId: string;

  @ManyToOne(() => ContentItemEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_item_id' })
  contentItem: ContentItemEntity;

  @CreateDateColumn({ name: 'saved_at' })
  savedAt: Date;
}
