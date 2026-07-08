import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { WebinarRegistrationService } from './webinar-registration.service';

@ApiTags('Admin — Webinar Registrations')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/webinar-registrations')
export class WebinarRegistrationAdminController {
  constructor(private readonly webinarRegistrationService: WebinarRegistrationService) {}

  @Get()
  @ApiOperation({ summary: 'List all webinar registrations (admin)' })
  findAll() {
    return this.webinarRegistrationService.findAllAdmin();
  }
}
