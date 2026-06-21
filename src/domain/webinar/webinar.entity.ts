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
import { TherapyAreaEntity } from '../therapy-area/therapy-area.entity';
import { FacultyEntity } from '../faculty/faculty.entity';

@Entity('webinars')
export class WebinarEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'therapy_area_id', type: 'uuid', nullable: true })
  @Index()
  therapyAreaId: string;

  @ManyToOne(() => TherapyAreaEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'therapy_area_id' })
  therapyArea: TherapyAreaEntity;

  @Column({ type: 'varchar' }) title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ name: 'scheduled_at', type: 'timestamp with time zone' }) scheduledAt: Date;
  @Column({ name: 'duration_minutes', type: 'int', nullable: true }) durationMinutes: number;
  @Column({ name: 'registration_link', type: 'text', nullable: true }) registrationLink: string;
  @Column({ name: 'is_live', type: 'boolean', default: false }) isLive: boolean;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;

  @ManyToMany(() => FacultyEntity)
  @JoinTable({
    name: 'webinar_faculty',
    joinColumn: { name: 'webinar_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'faculty_id', referencedColumnName: 'id' },
  })
  faculty: FacultyEntity[];

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
