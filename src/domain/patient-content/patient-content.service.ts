import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientContentEntity } from './patient-content.entity';
import { CreatePatientContentDto } from './dto/create-patient-content.dto';
import { UpdatePatientContentDto } from './dto/update-patient-content.dto';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class PatientContentService {
  private readonly logger = new Logger('PatientContentService');

  constructor(
    @InjectRepository(PatientContentEntity)
    private readonly patientContentRepository: Repository<PatientContentEntity>,
  ) {}

  async findByCondition(conditionId: string, journeyStage?: string): Promise<PatientContentEntity[]> {
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

  async findById(id: string): Promise<PatientContentEntity> {
    this.logger.log('Fetching patient content by id', { id });
    const content = await this.patientContentRepository.findOne({ where: { id, isActive: true } });
    if (!content) throw new NotFoundException(`Patient content '${id}' not found`);
    return content;
  }

  async findAllAdmin(): Promise<PatientContentEntity[]> {
    return this.patientContentRepository.find({ order: { orderIndex: 'ASC' } });
  }

  async create(dto: CreatePatientContentDto): Promise<PatientContentEntity> {
    this.logger.log('Creating patient content', { title: dto.title });
    const content = this.patientContentRepository.create(dto);
    return this.patientContentRepository.save(content);
  }

  async update(id: string, dto: UpdatePatientContentDto): Promise<PatientContentEntity> {
    this.logger.log('Updating patient content', { id });
    await this.patientContentRepository.update(id, dto);
    return this.patientContentRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<{ message: string }> {
    this.logger.log('Removing patient content', { id });
    const content = await this.patientContentRepository.findOne({ where: { id } });
    if (!content) throw new NotFoundException(`Patient content '${id}' not found`);
    await this.patientContentRepository.remove(content);
    return { message: 'Deleted successfully' };
  }
}
