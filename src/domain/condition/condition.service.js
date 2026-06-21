import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConditionEntity } from './condition.entity.js';
import { Logger } from '../../common/utils/logger.js';

@Injectable()
export class ConditionService {
  constructor(@InjectRepository(ConditionEntity) conditionRepository) {
    this.conditionRepository = conditionRepository;
    this.logger = new Logger('ConditionService');
  }

  async findAll() {
    this.logger.log('Fetching all conditions');
    return this.conditionRepository.find({
      where: { isActive: true },
      order: { orderIndex: 'ASC' },
    });
  }

  async findBySlug(slug) {
    this.logger.log('Fetching condition by slug', { slug });
    const condition = await this.conditionRepository.findOne({
      where: { slug, isActive: true },
    });
    if (!condition) throw new NotFoundException(`Condition '${slug}' not found`);
    return condition;
  }
}
