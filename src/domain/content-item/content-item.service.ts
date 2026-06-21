import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentItemEntity } from './content-item.entity';
import { ContentViewEntity } from '../content-view/content-view.entity';
import { Logger } from '../../common/utils/logger';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';

@Injectable()
export class ContentItemService {
  private readonly logger = new Logger('ContentItemService');

  constructor(
    @InjectRepository(ContentItemEntity) private readonly contentItemRepository: Repository<ContentItemEntity>,
    @InjectRepository(ContentViewEntity) private readonly contentViewRepository: Repository<ContentViewEntity>,
  ) {}

  async findByTopic(topicId: string, filters: { contentType?: string } = {}): Promise<ContentItemEntity[]> {
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

  async findById(id: string): Promise<ContentItemEntity> {
    this.logger.log('Fetching content item by id', { id });
    const item = await this.contentItemRepository.findOne({
      where: { id, isActive: true },
      relations: { faculty: true, topic: true },
    });
    if (!item) throw new NotFoundException(`Content item '${id}' not found`);
    return item;
  }

  async findAllAdmin(): Promise<ContentItemEntity[]> {
    return this.contentItemRepository.find({
      order: { publishedAt: 'DESC' },
      relations: { faculty: true, topic: true },
    });
  }

  async create(dto: CreateContentItemDto): Promise<ContentItemEntity> {
    this.logger.log('Creating content item', { title: dto.title });
    const item = this.contentItemRepository.create(dto);
    return this.contentItemRepository.save(item);
  }

  async update(id: string, dto: UpdateContentItemDto): Promise<ContentItemEntity> {
    this.logger.log('Updating content item', { id });
    await this.contentItemRepository.update(id, dto);
    return this.contentItemRepository.findOne({
      where: { id },
      relations: { faculty: true, topic: true },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    this.logger.log('Removing content item', { id });
    const item = await this.contentItemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Content item '${id}' not found`);
    await this.contentItemRepository.remove(item);
    return { message: 'Deleted successfully' };
  }

  async recordView(
    userId: string | null,
    sessionId: string | null,
    therapyAreaId: string,
    contentItemId: string,
  ): Promise<ContentViewEntity> {
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
