import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { TrainingProgramRegistrationService } from './training-program-registration.service';

@ApiTags('Admin — Training Program Registrations')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/training-program-registrations')
export class TrainingProgramRegistrationAdminController {
  constructor(private readonly trainingProgramRegistrationService: TrainingProgramRegistrationService) {}

  @Get()
  @ApiOperation({ summary: 'List all training program registrations (admin)' })
  findAll() {
    return this.trainingProgramRegistrationService.findAllAdmin();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update training program registration status' })
  @ApiParam({ name: 'id' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string' } } } })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.trainingProgramRegistrationService.updateStatus(id, body.status);
  }
}
