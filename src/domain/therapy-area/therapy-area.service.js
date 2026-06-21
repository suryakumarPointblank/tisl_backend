import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TherapyAreaEntity } from './therapy-area.entity.js';
import { Logger } from '../../common/utils/logger.js';

@Injectable()
export class TherapyAreaService {
  constructor(@InjectRepository(TherapyAreaEntity) therapyAreaRepository) {
    this.therapyAreaRepository = therapyAreaRepository;
    this.logger = new Logger('TherapyAreaService');
  }

  async findAll() {
    this.logger.log('Fetching all therapy areas');
    return this.therapyAreaRepository.find({
      where: { isActive: true },
      order: { orderIndex: 'ASC' },
      relations: ['subSections'],
    });
  }

  async findBySlug(slug) {
    this.logger.log('Fetching therapy area by slug', { slug });
    const area = await this.therapyAreaRepository.findOne({
      where: { slug, isActive: true },
      relations: ['subSections'],
    });
    if (!area) throw new NotFoundException(`Therapy area '${slug}' not found`);
    return area;
  }

  async findById(id) {
    this.logger.log('Fetching therapy area by id', { id });
    const area = await this.therapyAreaRepository.findOne({
      where: { id },
      relations: ['subSections'],
    });
    if (!area) throw new NotFoundException(`Therapy area not found`);
    return area;
  }
}
