import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubSectionEntity } from './sub-section.entity.js';
import { Logger } from '../../common/utils/logger.js';

@Injectable()
export class SubSectionService {
  constructor(@InjectRepository(SubSectionEntity) subSectionRepository) {
    this.subSectionRepository = subSectionRepository;
    this.logger = new Logger('SubSectionService');
  }

  async findByTherapyArea(therapyAreaId) {
    this.logger.log('Fetching sub-sections by therapy area', { therapyAreaId });
    return this.subSectionRepository.find({
      where: { therapyAreaId, isActive: true },
      order: { orderIndex: 'ASC' },
      relations: ['topics'],
    });
  }

  async findBySlug(slug) {
    this.logger.log('Fetching sub-section by slug', { slug });
    const subSection = await this.subSectionRepository.findOne({
      where: { slug, isActive: true },
      relations: ['topics', 'therapyArea'],
    });
    if (!subSection) throw new NotFoundException(`Sub-section '${slug}' not found`);
    return subSection;
  }

  async findById(id) {
    this.logger.log('Fetching sub-section by id', { id });
    const subSection = await this.subSectionRepository.findOne({
      where: { id, isActive: true },
    });
    if (!subSection) throw new NotFoundException(`Sub-section not found`);
    return subSection;
  }
}
