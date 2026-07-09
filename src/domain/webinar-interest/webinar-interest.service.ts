import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebinarInterestEntity } from './webinar-interest.entity';
import { CreateWebinarInterestDto } from './dto/create-webinar-interest.dto';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class WebinarInterestService {
  private readonly logger = new Logger('WebinarInterestService');

  constructor(
    @InjectRepository(WebinarInterestEntity)
    private readonly repo: Repository<WebinarInterestEntity>,
  ) {}

  findAllAdmin(): Promise<WebinarInterestEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateWebinarInterestDto): Promise<WebinarInterestEntity> {
    this.logger.log('Creating webinar interest', { email: dto.email });
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }
}
