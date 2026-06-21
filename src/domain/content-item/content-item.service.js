import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentItemEntity } from './content-item.entity.js';
import { ContentViewEntity } from '../content-view/content-view.entity.js';
import { Logger } from '../../common/utils/logger.js';

@Injectable()
export class ContentItemService {
  constructor(
    @InjectRepository(ContentItemEntity) contentItemRepository,
    @InjectRepository(ContentViewEntity) contentViewRepository,
  ) {
    this.contentItemRepository = contentItemRepository;
    this.contentViewRepository = contentViewRepository;
    this.logger = new Logger('ContentItemService');
  }

  async findByTopic(topicId, filters = {}) {
    this.logger.log('Fetching content items by topic', { topicId, filters });
    const qb = this.contentItemRepository
      .createQueryBuilder('ci')
      .leftJoinAndSelect('ci.faculty', 'faculty')
      .where('ci.topicId = :topicId', { topicId })
      .andWhere('ci.isActive = true');

    if (filters.contentType) {
      qb.andWhere('ci.contentType = :contentType', { contentType: filters.contentType });
    }

    return qb.orderBy('ci.publishedAt', 'DESC').getMany();
  }

  async findById(id) {
    this.logger.log('Fetching content item by id', { id });
    const item = await this.contentItemRepository.findOne({
      where: { id, isActive: true },
      relations: ['faculty', 'topic'],
    });
    if (!item) throw new NotFoundException(`Content item '${id}' not found`);
    return item;
  }

  async recordView(userId, sessionId, therapyAreaId, contentItemId) {
    this.logger.log('Recording content view', { userId, contentItemId });
    const view = this.contentViewRepository.create({
      userId: userId || null,
      sessionId: sessionId || null,
      therapyAreaId,
      contentItemId,
    });
    return this.contentViewRepository.save(view);
  }
}
