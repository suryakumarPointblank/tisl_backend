import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../../domain/user/user.entity.js';

@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user;

  @Column({ name: 'token_hash', type: 'varchar' })
  tokenHash;

  @Column({ name: 'expires_at', type: 'timestamp with time zone' })
  expiresAt;

  @Column({ name: 'is_revoked', type: 'boolean', default: false })
  isRevoked;

  @CreateDateColumn({ name: 'created_at' })
  createdAt;
}
