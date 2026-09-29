import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebinarInterestEntity } from './webinar-interest.entity';
import { CreateWebinarInterestDto } from './dto/create-webinar-interest.dto';
import { Logger } from '../../common/utils/logger';
import { MailService } from '../../infrastructure/mail/mail.service';

@Injectable()
export class WebinarInterestService {
  private readonly logger = new Logger('WebinarInterestService');

  constructor(
    @InjectRepository(WebinarInterestEntity)
    private readonly repo: Repository<WebinarInterestEntity>,
    private readonly mailService: MailService,
  ) {}

  findAllAdmin(): Promise<WebinarInterestEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateWebinarInterestDto): Promise<WebinarInterestEntity> {
    this.logger.log('Creating webinar interest', { email: dto.email });
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    await this.mailService.notifyGeneral(`New Webinar Interest from ${dto.firstName} ${dto.lastName}`, {
      Name: `${dto.firstName} ${dto.lastName}`,
      Email: dto.email,
      Mobile: dto.mobile,
      Hospital: dto.hospital,
      Speciality: dto.speciality,
      'Attend Preference': dto.attendPreference,
      'Content Item': dto.contentItemId,
    });
    return saved;
  }
}
