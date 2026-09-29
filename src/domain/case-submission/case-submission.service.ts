import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseSubmissionEntity } from './case-submission.entity';
import { CreateCaseSubmissionDto } from './dto/create-case-submission.dto';
import { Logger } from '../../common/utils/logger';
import { MailService } from '../../infrastructure/mail/mail.service';

@Injectable()
export class CaseSubmissionService {
  private readonly logger = new Logger('CaseSubmissionService');

  constructor(
    @InjectRepository(CaseSubmissionEntity)
    private readonly repo: Repository<CaseSubmissionEntity>,
    private readonly mailService: MailService,
  ) {}

  findAllAdmin(): Promise<CaseSubmissionEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, status: string): Promise<CaseSubmissionEntity> {
    await this.repo.update(id, { status });
    return this.repo.findOneOrFail({ where: { id } });
  }

  async create(dto: CreateCaseSubmissionDto, userId?: string): Promise<CaseSubmissionEntity> {
    this.logger.log('Creating case submission', { title: dto.title, submitterEmail: dto.submitterEmail });
    const submission = this.repo.create({ ...dto, userId: userId ?? null });
    const saved = await this.repo.save(submission);
    await this.mailService.notifyGeneral(`New Case Submission: ${dto.title}`, {
      Title: dto.title,
      'Therapy Area': dto.therapyArea,
      Topic: dto.topic,
      'Submitted By': dto.submitterName,
      Email: dto.submitterEmail,
      Institution: dto.submitterInstitution,
      City: dto.submitterCity,
    });
    return saved;
  }

  async findAll(): Promise<CaseSubmissionEntity[]> {
    this.logger.log('Fetching all case submissions');
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }
}
