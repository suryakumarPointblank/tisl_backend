import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConditionEntity } from './condition.entity';
import { Logger } from '../../common/utils/logger';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';

@Injectable()
export class ConditionService {
  private readonly logger = new Logger('ConditionService');

  constructor(
    @InjectRepository(ConditionEntity) private readonly conditionRepository: Repository<ConditionEntity>,
  ) {}

  async findAll(): Promise<ConditionEntity[]> {
    this.logger.log('Fetching all conditions');
    return this.conditionRepository.find({
      where: { isActive: true },
      order: { orderIndex: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<ConditionEntity> {
    this.logger.log('Fetching condition by slug', { slug });
    const condition = await this.conditionRepository.findOne({
      where: { slug, isActive: true },
    });
    if (!condition) throw new NotFoundException(`Condition '${slug}' not found`);
    return condition;
  }

  async findById(id: string): Promise<ConditionEntity> {
    this.logger.log('Fetching condition by id', { id });
    const condition = await this.conditionRepository.findOne({ where: { id } });
    if (!condition) throw new NotFoundException(`Condition not found`);
    return condition;
  }

  async findAllAdmin(): Promise<ConditionEntity[]> {
    return this.conditionRepository.find({ order: { orderIndex: 'ASC' } });
  }

  async create(dto: CreateConditionDto): Promise<ConditionEntity> {
    this.logger.log('Creating condition', { name: dto.name });
    const condition = this.conditionRepository.create(dto);
    return this.conditionRepository.save(condition);
  }

  async update(id: string, dto: UpdateConditionDto): Promise<ConditionEntity> {
    this.logger.log('Updating condition', { id });
    await this.conditionRepository.update(id, dto);
    return this.findById(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    this.logger.log('Removing condition', { id });
    const condition = await this.findById(id);
    await this.conditionRepository.remove(condition);
    return { message: 'Deleted successfully' };
  }
}
