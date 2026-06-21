import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentLikeEntity } from './content-like.entity.js';
import { ContentItemEntity } from '../content-item/content-item.entity.js';
import { PatientContentEntity } from '../patient-content/patient-content.entity.js';
import { Logger } from '../../common/utils/logger.js';

@Injectable()
export class ContentLikeService {
  constructor(
    @InjectRepository(ContentLikeEntity) contentLikeRepository,
    @InjectRepository(ContentItemEntity) contentItemRepository,
    @InjectRepository(PatientContentEntity) patientContentRepository,
  ) {
    this.contentLikeRepository = contentLikeRepository;
    this.contentItemRepository = contentItemRepository;
    this.patientContentRepository = patientContentRepository;
    this.logger = new Logger('ContentLikeService');
  }

  async toggleLike(userId, contentItemId, patientContentId) {
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

  async getLikeCount(contentItemId, patientContentId) {
    const where = contentItemId ? { contentItemId } : { patientContentId };
    const count = await this.contentLikeRepository.count({ where });
    return { count };
  }

  async getUserLikes(userId) {
    this.logger.log('Fetching user likes', { userId });
    return this.contentLikeRepository.find({ where: { userId } });
  }
}
