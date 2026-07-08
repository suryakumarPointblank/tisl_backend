import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseSubmissionEntity } from './case-submission.entity';
import { CreateCaseSubmissionDto } from './dto/create-case-submission.dto';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class CaseSubmissionService {
  private readonly logger = new Logger('CaseSubmissionService');

  constructor(
    @InjectRepository(CaseSubmissionEntity)
    private readonly repo: Repository<CaseSubmissionEntity>,
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
    return this.repo.save(submission);
  }

  async findAll(): Promise<CaseSubmissionEntity[]> {
    this.logger.log('Fetching all case submissions');
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }
}
