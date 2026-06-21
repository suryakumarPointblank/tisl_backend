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
import { PatientContentEntity } from '../patient-content/patient-content.entity';

@Entity('content_likes')
@Unique(['userId', 'contentItemId'])
@Unique(['userId', 'patientContentId'])
export class ContentLikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'content_item_id', type: 'uuid', nullable: true })
  @Index()
  contentItemId: string;

  @ManyToOne(() => ContentItemEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_item_id' })
  contentItem: ContentItemEntity;

  @Column({ name: 'patient_content_id', type: 'uuid', nullable: true })
  @Index()
  patientContentId: string;

  @ManyToOne(() => PatientContentEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_content_id' })
  patientContent: PatientContentEntity;

  @CreateDateColumn({ name: 'liked_at' })
  likedAt: Date;
}
