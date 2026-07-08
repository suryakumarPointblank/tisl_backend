import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseSubmissionEntity } from './case-submission.entity';
import { CaseSubmissionService } from './case-submission.service';
import { CaseSubmissionController } from './case-submission.controller';
import { CaseSubmissionAdminController } from './case-submission-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CaseSubmissionEntity])],
  controllers: [CaseSubmissionController, CaseSubmissionAdminController],
  providers: [CaseSubmissionService],
  exports: [CaseSubmissionService],
})
export class CaseSubmissionModule {}
