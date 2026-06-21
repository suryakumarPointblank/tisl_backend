import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Index,
} from 'typeorm';
import { TherapyAreaEntity } from '../therapy-area/therapy-area.entity.js';
import { FacultyEntity } from '../faculty/faculty.entity.js';

@Entity('webinars')
export class WebinarEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ name: 'therapy_area_id', type: 'uuid', nullable: true })
  @Index()
  therapyAreaId;

  @ManyToOne(() => TherapyAreaEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'therapy_area_id' })
  therapyArea;

  @Column({ type: 'varchar' })
  title;

  @Column({ type: 'text', nullable: true })
  description;

  @Column({ name: 'scheduled_at', type: 'timestamp with time zone' })
  scheduledAt;

  @Column({ name: 'duration_minutes', type: 'int', nullable: true })
  durationMinutes;

  @Column({ name: 'registration_link', type: 'text', nullable: true })
  registrationLink;

  @Column({ name: 'is_live', type: 'boolean', default: false })
  isLive;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive;

  @ManyToMany(() => FacultyEntity)
  @JoinTable({
    name: 'webinar_faculty',
    joinColumn: { name: 'webinar_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'faculty_id', referencedColumnName: 'id' },
  })
  faculty;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
