import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentLikeEntity } from './content-like.entity';
import { ContentItemEntity } from '../content-item/content-item.entity';
import { PatientContentEntity } from '../patient-content/patient-content.entity';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class ContentLikeService {
  private readonly logger = new Logger('ContentLikeService');

  constructor(
    @InjectRepository(ContentLikeEntity)
    private readonly contentLikeRepository: Repository<ContentLikeEntity>,
    @InjectRepository(ContentItemEntity)
    private readonly contentItemRepository: Repository<ContentItemEntity>,
    @InjectRepository(PatientContentEntity)
    private readonly patientContentRepository: Repository<PatientContentEntity>,
  ) {}

  async toggleLike(
    userId: string,
    contentItemId?: string,
    patientContentId?: string,
  ): Promise<{ liked: boolean }> {
    this.logger.log('Toggle like', { userId, contentItemId, patientContentId });
    const where = contentItemId ? { userId, contentItemId } : { userId, patientContentId };
    const existing = await this.contentLikeRepository.findOne({ where });
    if (existing) {
      await this.contentLikeRepository.remove(existing);
      this.logger.log('Like removed', { userId, contentItemId, patientContentId });
      return { liked: false };
    }
    await this.contentLikeRepository.save(
      this.contentLikeRepository.create({
        userId,
        contentItemId: contentItemId || null,
        patientContentId: patientContentId || null,
      }),
    );
    this.logger.log('Like added', { userId, contentItemId, patientContentId });
    return { liked: true };
  }

  async getLikeCount(
    contentItemId?: string,
    patientContentId?: string,
  ): Promise<{ count: number }> {
    const where = contentItemId ? { contentItemId } : { patientContentId };
    const count = await this.contentLikeRepository.count({ where });
    return { count };
  }

  async getUserLikes(userId: string): Promise<ContentLikeEntity[]> {
    this.logger.log('Fetching user likes', { userId });
    return this.contentLikeRepository.find({
      where: { userId },
      relations: { contentItem: true },
      order: { likedAt: 'DESC' },
    });
  }

  async getContentLikeStats(): Promise<{ contentItemId: string; title: string; contentType: string; likeCount: number }[]> {
    this.logger.log('Fetching content like stats');
    const rows = await this.contentLikeRepository
      .createQueryBuilder('cl')
      .select('cl.contentItemId', 'contentItemId')
      .addSelect('ci.title', 'title')
      .addSelect('ci.contentType', 'contentType')
      .addSelect('COUNT(cl.id)', 'likeCount')
      .innerJoin('cl.contentItem', 'ci')
      .where('cl.contentItemId IS NOT NULL')
      .groupBy('cl.contentItemId')
      .addGroupBy('ci.title')
      .addGroupBy('ci.contentType')
      .orderBy('COUNT(cl.id)', 'DESC')
      .getRawMany();
    return rows.map((r) => ({ ...r, likeCount: parseInt(r.likeCount, 10) }));
  }
}
