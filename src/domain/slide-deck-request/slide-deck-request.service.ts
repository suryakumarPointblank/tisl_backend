import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlideDeckRequestEntity } from './slide-deck-request.entity';
import { CreateSlideDeckRequestDto } from './dto/create-slide-deck-request.dto';
import { Logger } from '../../common/utils/logger';
import { MailService } from '../../infrastructure/mail/mail.service';

@Injectable()
export class SlideDeckRequestService {
  private readonly logger = new Logger('SlideDeckRequestService');

  constructor(
    @InjectRepository(SlideDeckRequestEntity)
    private readonly repo: Repository<SlideDeckRequestEntity>,
    private readonly mailService: MailService,
  ) {}

  findAllAdmin(): Promise<SlideDeckRequestEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, status: string): Promise<SlideDeckRequestEntity> {
    await this.repo.update(id, { status });
    return this.repo.findOneOrFail({ where: { id } });
  }

  async create(dto: CreateSlideDeckRequestDto): Promise<SlideDeckRequestEntity> {
    this.logger.log('Creating slide deck request', { email: dto.email });
    const request = this.repo.create(dto);
    const saved = await this.repo.save(request);
    await this.mailService.notifyGeneral(`New Slide Deck Request from ${dto.firstName} ${dto.lastName}`, {
      Name: `${dto.firstName} ${dto.lastName}`,
      Email: dto.email,
      Speciality: dto.speciality,
      'Content Item': dto.contentItemId,
      'HCP Confirmed': dto.isHcpConfirmed,
      'Consent Given': dto.isConsentGiven,
    });
    return saved;
  }
}
