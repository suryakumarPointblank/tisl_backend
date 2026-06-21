import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('faculty')
export class FacultyEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  name;

  @Column({ type: 'varchar', nullable: true })
  designation;

  @Column({ type: 'varchar', nullable: true })
  hospital;

  @Column({ type: 'varchar', nullable: true })
  city;

  @Column({ type: 'text', nullable: true })
  bio;

  @Column({ name: 'photo_url', type: 'varchar', nullable: true })
  photoUrl;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt;
}
