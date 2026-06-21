import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientContentEntity } from './patient-content.entity.js';
import { Logger } from '../../common/utils/logger.js';

@Injectable()
export class PatientContentService {
  constructor(@InjectRepository(PatientContentEntity) patientContentRepository) {
    this.patientContentRepository = patientContentRepository;
    this.logger = new Logger('PatientContentService');
  }

  async findByCondition(conditionId, journeyStage) {
    this.logger.log('Fetching patient content by condition', { conditionId, journeyStage });
    const qb = this.patientContentRepository
      .createQueryBuilder('pc')
      .where('pc.conditionId = :conditionId', { conditionId })
      .andWhere('pc.isActive = true');

    if (journeyStage) {
      qb.andWhere('pc.journeyStage = :journeyStage', { journeyStage });
    }

    return qb.orderBy('pc.orderIndex', 'ASC').getMany();
  }

  async findById(id) {
    this.logger.log('Fetching patient content by id', { id });
    const content = await this.patientContentRepository.findOne({
      where: { id, isActive: true },
    });
    if (!content) throw new NotFoundException(`Patient content '${id}' not found`);
    return content;
  }
}
