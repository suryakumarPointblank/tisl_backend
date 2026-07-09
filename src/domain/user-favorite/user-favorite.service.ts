import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFavoriteEntity } from './user-favorite.entity';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class UserFavoriteService {
  private readonly logger = new Logger('UserFavoriteService');

  constructor(
    @InjectRepository(UserFavoriteEntity)
    private readonly repo: Repository<UserFavoriteEntity>,
  ) {}

  async toggle(userId: string, contentItemId: string): Promise<{ saved: boolean }> {
    this.logger.log('Toggle favorite', { userId, contentItemId });
    const existing = await this.repo.findOne({ where: { userId, contentItemId } });
    if (existing) {
      await this.repo.remove(existing);
      return { saved: false };
    }
    await this.repo.save(this.repo.create({ userId, contentItemId }));
    return { saved: true };
  }

  async getUserFavorites(userId: string): Promise<UserFavoriteEntity[]> {
    this.logger.log('Fetching user favorites', { userId });
    return this.repo.find({
      where: { userId },
      relations: { contentItem: { topic: { subSection: { therapyArea: true } } } },
      order: { savedAt: 'DESC' },
    });
  }

  async isFavorited(userId: string, contentItemId: string): Promise<{ saved: boolean }> {
    const exists = await this.repo.findOne({ where: { userId, contentItemId } });
    return { saved: !!exists };
  }

  async getFavoriteCount(contentItemId: string): Promise<{ count: number }> {
    const count = await this.repo.count({ where: { contentItemId } });
    return { count };
  }
}
