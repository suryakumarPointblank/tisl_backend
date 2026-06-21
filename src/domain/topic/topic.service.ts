import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicEntity } from './topic.entity';
import { Logger } from '../../common/utils/logger';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicService {
  private readonly logger = new Logger('TopicService');

  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
  ) {}

  async findBySubSection(subSectionId: string): Promise<TopicEntity[]> {
    this.logger.log('Fetching topics by sub-section', { subSectionId });
    return this.topicRepository.find({
      where: { subSectionId, isActive: true },
      order: { orderIndex: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<TopicEntity> {
    this.logger.log('Fetching topic by slug', { slug });
    const topic = await this.topicRepository.findOne({
      where: { slug, isActive: true },
      relations: { subSection: { therapyArea: true } },
    });
    if (!topic) throw new NotFoundException(`Topic '${slug}' not found`);
    return topic;
  }

  async findById(id: string): Promise<TopicEntity> {
    this.logger.log('Fetching topic by id', { id });
    const topic = await this.topicRepository.findOne({ where: { id, isActive: true } });
    if (!topic) throw new NotFoundException(`Topic not found`);
    return topic;
  }

  async findAllAdmin(): Promise<TopicEntity[]> {
    return this.topicRepository.find({ order: { orderIndex: 'ASC' } });
  }

  async create(dto: CreateTopicDto): Promise<TopicEntity> {
    this.logger.log('Creating topic', { name: dto.name });
    const topic = this.topicRepository.create(dto);
    return this.topicRepository.save(topic);
  }

  async update(id: string, dto: UpdateTopicDto): Promise<TopicEntity> {
    this.logger.log('Updating topic', { id });
    await this.topicRepository.update(id, dto);
    return this.topicRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<{ message: string }> {
    this.logger.log('Removing topic', { id });
    const topic = await this.topicRepository.findOne({ where: { id } });
    if (!topic) throw new NotFoundException(`Topic not found`);
    await this.topicRepository.remove(topic);
    return { message: 'Deleted successfully' };
  }
}
