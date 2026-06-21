import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { TopicEntity } from '../topic/topic.entity';
import { FacultyEntity } from '../faculty/faculty.entity';

export const ContentType = {
  WEBINAR_VIDEO: 'WEBINAR_VIDEO',
  PROCEDURE_DEMO: 'PROCEDURE_DEMO',
  CASE_STUDY: 'CASE_STUDY',
  INFOGRAPHIC: 'INFOGRAPHIC',
  SLIDE_PRESENTATION: 'SLIDE_PRESENTATION',
  EXPERT_OPINION: 'EXPERT_OPINION',
  ARTICLE_SUMMARY: 'ARTICLE_SUMMARY',
  PODCAST: 'PODCAST',
  SHORT_VIDEO: 'SHORT_VIDEO',
  LATEST_UPDATE: 'LATEST_UPDATE',
  SLIDESHOW: 'SLIDESHOW',
} as const;

@Entity('content_items')
export class ContentItemEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'topic_id', type: 'uuid' })
  @Index()
  topicId: string;

  @ManyToOne(() => TopicEntity, (t) => t.contentItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic: TopicEntity;

  @Column({ name: 'faculty_id', type: 'uuid', nullable: true })
  @Index()
  facultyId: string | null;

  @ManyToOne(() => FacultyEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'faculty_id' })
  faculty: FacultyEntity | null;

  @Column({ name: 'content_type', type: 'varchar' }) contentType: string;
  @Column({ type: 'varchar' }) title: string;
  @Column({ type: 'text', nullable: true }) description: string | null;
  @Column({ name: 'duration_minutes', type: 'int', nullable: true }) durationMinutes: number | null;
  @Column({ name: 'file_url', type: 'text', nullable: true }) fileUrl: string | null;
  @Column({ name: 'thumbnail_url', type: 'text', nullable: true }) thumbnailUrl: string | null;
  @Column({ name: 'content_data', type: 'jsonb', nullable: true }) contentData: Record<string, unknown> | null;
  @Column({ name: 'published_at', type: 'timestamp with time zone', nullable: true }) publishedAt: Date | null;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
