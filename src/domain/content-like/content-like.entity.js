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
import { UserEntity } from '../user/user.entity.js';
import { ContentItemEntity } from '../content-item/content-item.entity.js';
import { PatientContentEntity } from '../patient-content/patient-content.entity.js';

@Entity('content_likes')
@Unique(['userId', 'contentItemId'])
@Unique(['userId', 'patientContentId'])
export class ContentLikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user;

  @Column({ name: 'content_item_id', type: 'uuid', nullable: true })
  @Index()
  contentItemId;

  @ManyToOne(() => ContentItemEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_item_id' })
  contentItem;

  @Column({ name: 'patient_content_id', type: 'uuid', nullable: true })
  @Index()
  patientContentId;

  @ManyToOne(() => PatientContentEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_content_id' })
  patientContent;

  @CreateDateColumn({ name: 'liked_at' })
  likedAt;
}
