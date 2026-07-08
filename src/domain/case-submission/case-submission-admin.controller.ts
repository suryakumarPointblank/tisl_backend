import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CaseSubmissionService } from './case-submission.service';

@ApiTags('Admin — Case Submissions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/case-submissions')
export class CaseSubmissionAdminController {
  constructor(private readonly caseSubmissionService: CaseSubmissionService) {}

  @Get()
  @ApiOperation({ summary: 'List all case submissions (admin)' })
  findAll() {
    return this.caseSubmissionService.findAllAdmin();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update case submission status' })
  @ApiParam({ name: 'id' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string' } } } })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.caseSubmissionService.updateStatus(id, body.status);
  }
}
