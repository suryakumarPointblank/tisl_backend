import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicEntity } from './topic.entity.js';
import { Logger } from '../../common/utils/logger.js';

@Injectable()
export class TopicService {
  constructor(@InjectRepository(TopicEntity) topicRepository) {
    this.topicRepository = topicRepository;
    this.logger = new Logger('TopicService');
  }

  async findBySubSection(subSectionId) {
    this.logger.log('Fetching topics by sub-section', { subSectionId });
    return this.topicRepository.find({
      where: { subSectionId, isActive: true },
      order: { orderIndex: 'ASC' },
    });
  }

  async findBySlug(slug) {
    this.logger.log('Fetching topic by slug', { slug });
    const topic = await this.topicRepository.findOne({
      where: { slug, isActive: true },
      relations: ['subSection', 'subSection.therapyArea'],
    });
    if (!topic) throw new NotFoundException(`Topic '${slug}' not found`);
    return topic;
  }

  async findById(id) {
    this.logger.log('Fetching topic by id', { id });
    const topic = await this.topicRepository.findOne({ where: { id, isActive: true } });
    if (!topic) throw new NotFoundException(`Topic not found`);
    return topic;
  }
}
