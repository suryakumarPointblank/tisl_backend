import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PatientContentService } from './patient-content.service';
import { CreatePatientContentDto } from './dto/create-patient-content.dto';
import { UpdatePatientContentDto } from './dto/update-patient-content.dto';

@ApiTags('Admin — Patient Content')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/patient-content')
export class PatientContentAdminController {
  constructor(private readonly patientContentService: PatientContentService) {}

  @Get()
  @ApiOperation({ summary: 'List all patient content (admin)' })
  findAll() {
    return this.patientContentService.findAllAdmin();
  }

  @Post()
  @ApiOperation({ summary: 'Create patient content' })
  @ApiBody({ type: CreatePatientContentDto })
  create(@Body() dto: CreatePatientContentDto) {
    return this.patientContentService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update patient content' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdatePatientContentDto })
  update(@Param('id') id: string, @Body() dto: UpdatePatientContentDto) {
    return this.patientContentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete patient content' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.patientContentService.remove(id);
  }
}
