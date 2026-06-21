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
import { TopicEntity } from '../topic/topic.entity.js';
import { FacultyEntity } from '../faculty/faculty.entity.js';

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
};

@Entity('content_items')
export class ContentItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ name: 'topic_id', type: 'uuid' })
  @Index()
  topicId;

  @ManyToOne(() => TopicEntity, (t) => t.contentItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic;

  @Column({ name: 'faculty_id', type: 'uuid', nullable: true })
  @Index()
  facultyId;

  @ManyToOne(() => FacultyEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'faculty_id' })
  faculty;

  @Column({ name: 'content_type', type: 'varchar' })
  contentType;

  @Column({ type: 'varchar' })
  title;

  @Column({ type: 'text', nullable: true })
  description;

  @Column({ name: 'duration_minutes', type: 'int', nullable: true })
  durationMinutes;

  @Column({ name: 'file_url', type: 'text', nullable: true })
  fileUrl;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl;

  @Column({ name: 'content_data', type: 'jsonb', nullable: true })
  contentData;

  @Column({ name: 'published_at', type: 'timestamp with time zone', nullable: true })
  publishedAt;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
