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
    return this.contentLikeRepository.find({ where: { userId } });
  }
}
