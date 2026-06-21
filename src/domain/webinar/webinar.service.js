import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan } from 'typeorm';
import { WebinarEntity } from './webinar.entity.js';
import { Logger } from '../../common/utils/logger.js';

@Injectable()
export class WebinarService {
  constructor(@InjectRepository(WebinarEntity) webinarRepository) {
    this.webinarRepository = webinarRepository;
    this.logger = new Logger('WebinarService');
  }

  async findUpcoming() {
    this.logger.log('Fetching upcoming webinars');
    return this.webinarRepository.find({
      where: { isActive: true, scheduledAt: MoreThan(new Date()) },
      order: { scheduledAt: 'ASC' },
      relations: ['therapyArea', 'faculty'],
    });
  }

  async findByTherapyArea(therapyAreaId) {
    this.logger.log('Fetching webinars by therapy area', { therapyAreaId });
    return this.webinarRepository.find({
      where: { therapyAreaId, isActive: true },
      order: { scheduledAt: 'DESC' },
      relations: ['therapyArea', 'faculty'],
    });
  }

  async findById(id) {
    this.logger.log('Fetching webinar by id', { id });
    const webinar = await this.webinarRepository.findOne({
      where: { id, isActive: true },
      relations: ['therapyArea', 'faculty'],
    });
    if (!webinar) throw new NotFoundException(`Webinar '${id}' not found`);
    return webinar;
  }
}
