import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubSectionEntity } from './sub-section.entity';
import { Logger } from '../../common/utils/logger';
import { CreateSubSectionDto } from './dto/create-sub-section.dto';
import { UpdateSubSectionDto } from './dto/update-sub-section.dto';

@Injectable()
export class SubSectionService {
  private readonly logger = new Logger('SubSectionService');

  constructor(
    @InjectRepository(SubSectionEntity) private readonly subSectionRepository: Repository<SubSectionEntity>,
  ) {}

  async findByTherapyArea(therapyAreaId: string): Promise<SubSectionEntity[]> {
    this.logger.log('Fetching sub-sections by therapy area', { therapyAreaId });
    return this.subSectionRepository.find({
      where: { therapyAreaId, isActive: true },
      order: { orderIndex: 'ASC' },
      relations: { topics: true },
    });
  }

  async findBySlug(slug: string): Promise<SubSectionEntity> {
    this.logger.log('Fetching sub-section by slug', { slug });
    const subSection = await this.subSectionRepository.findOne({
      where: { slug, isActive: true },
      relations: { topics: true, therapyArea: true },
    });
    if (!subSection) throw new NotFoundException(`Sub-section '${slug}' not found`);
    return subSection;
  }

  async findById(id: string): Promise<SubSectionEntity> {
    this.logger.log('Fetching sub-section by id', { id });
    const subSection = await this.subSectionRepository.findOne({
      where: { id, isActive: true },
    });
    if (!subSection) throw new NotFoundException(`Sub-section not found`);
    return subSection;
  }

  async findAllAdmin(): Promise<SubSectionEntity[]> {
    return this.subSectionRepository.find({ order: { orderIndex: 'ASC' } });
  }

  async create(dto: CreateSubSectionDto): Promise<SubSectionEntity> {
    this.logger.log('Creating sub-section', { name: dto.name });
    const subSection = this.subSectionRepository.create(dto);
    return this.subSectionRepository.save(subSection);
  }

  async update(id: string, dto: UpdateSubSectionDto): Promise<SubSectionEntity> {
    this.logger.log('Updating sub-section', { id });
    await this.subSectionRepository.update(id, dto);
    return this.subSectionRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<{ message: string }> {
    this.logger.log('Removing sub-section', { id });
    const subSection = await this.subSectionRepository.findOne({ where: { id } });
    if (!subSection) throw new NotFoundException(`Sub-section not found`);
    await this.subSectionRepository.remove(subSection);
    return { message: 'Deleted successfully' };
  }
}
