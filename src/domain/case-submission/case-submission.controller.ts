import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CaseSubmissionService } from './case-submission.service';
import { CreateCaseSubmissionDto } from './dto/create-case-submission.dto';
import { OptionalJwtGuard } from '../../common/guards/optional-jwt.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Case Submissions')
@Controller('api/v1/cases')
export class CaseSubmissionController {
  constructor(private readonly caseSubmissionService: CaseSubmissionService) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a clinical case for review' })
  async create(@Body() dto: CreateCaseSubmissionDto, @GetUser() user: any) {
    const entity = await this.caseSubmissionService.create(dto, user?.id);
    return { message: 'Case submitted for review.', submissionId: entity.id };
  }
}
