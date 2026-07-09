import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';

@ApiTags('Admin — Specialities')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/specialities')
export class SpecialityAdminController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Get() @ApiOperation({ summary: 'List all specialities (admin)' })
  findAll() { return this.specialityService.findAllAdmin(); }

  @Post() @ApiOperation({ summary: 'Create speciality' }) @ApiBody({ type: CreateSpecialityDto })
  create(@Body() dto: CreateSpecialityDto) { return this.specialityService.create(dto); }

  @Patch(':id') @ApiOperation({ summary: 'Update speciality' }) @ApiParam({ name: 'id' }) @ApiBody({ type: UpdateSpecialityDto })
  update(@Param('id') id: string, @Body() dto: UpdateSpecialityDto) { return this.specialityService.update(id, dto); }

  @Delete(':id') @ApiOperation({ summary: 'Delete speciality' }) @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) { return this.specialityService.remove(id); }
}
