import {
  Entity, PrimaryColumn, Column, UpdateDateColumn,
} from 'typeorm';

@Entity('site_config')
export class SiteConfigEntity {
  @PrimaryColumn({ type: 'varchar' }) key: string;
  @Column({ type: 'text' }) value: string;
  @Column({ type: 'varchar', nullable: true }) description: string;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
