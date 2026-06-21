import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { WebinarEntity } from './webinar.entity';
import { CreateWebinarDto } from './dto/create-webinar.dto';
import { UpdateWebinarDto } from './dto/update-webinar.dto';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class WebinarService {
  private readonly logger = new Logger('WebinarService');

  constructor(
    @InjectRepository(WebinarEntity)
    private readonly webinarRepository: Repository<WebinarEntity>,
  ) {}

  async findUpcoming(): Promise<WebinarEntity[]> {
    this.logger.log('Fetching upcoming webinars');
    return this.webinarRepository.find({
      where: { isActive: true, scheduledAt: MoreThan(new Date()) },
      order: { scheduledAt: 'ASC' },
      relations: { therapyArea: true, faculty: true },
    });
  }

  async findByTherapyArea(therapyAreaId: string): Promise<WebinarEntity[]> {
    this.logger.log('Fetching webinars by therapy area', { therapyAreaId });
    return this.webinarRepository.find({
      where: { therapyAreaId, isActive: true },
      order: { scheduledAt: 'DESC' },
      relations: { therapyArea: true, faculty: true },
    });
  }

  async findById(id: string): Promise<WebinarEntity> {
    this.logger.log('Fetching webinar by id', { id });
    const webinar = await this.webinarRepository.findOne({
      where: { id, isActive: true },
      relations: { therapyArea: true, faculty: true },
    });
    if (!webinar) throw new NotFoundException(`Webinar '${id}' not found`);
    return webinar;
  }

  async findAllAdmin(): Promise<WebinarEntity[]> {
    return this.webinarRepository.find({
      order: { scheduledAt: 'DESC' },
      relations: { therapyArea: true, faculty: true },
    });
  }

  async create(dto: CreateWebinarDto): Promise<WebinarEntity> {
    this.logger.log('Creating webinar', { title: dto.title });
    const webinar = this.webinarRepository.create(dto);
    return this.webinarRepository.save(webinar);
  }

  async update(id: string, dto: UpdateWebinarDto): Promise<WebinarEntity> {
    this.logger.log('Updating webinar', { id });
    await this.webinarRepository.update(id, dto);
    return this.webinarRepository.findOne({
      where: { id },
      relations: { therapyArea: true, faculty: true },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    this.logger.log('Removing webinar', { id });
    const webinar = await this.webinarRepository.findOne({ where: { id } });
    if (!webinar) throw new NotFoundException(`Webinar '${id}' not found`);
    await this.webinarRepository.remove(webinar);
    return { message: 'Deleted successfully' };
  }
}
