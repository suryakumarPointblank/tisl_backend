import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { TherapyAreaService } from './therapy-area.service';
import { CreateTherapyAreaDto } from './dto/create-therapy-area.dto';
import { UpdateTherapyAreaDto } from './dto/update-therapy-area.dto';

@ApiTags('Admin — Therapy Areas')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/therapy-areas')
export class TherapyAreaAdminController {
  constructor(private readonly therapyAreaService: TherapyAreaService) {}

  @Get() @ApiOperation({ summary: 'List all therapy areas (admin)' })
  findAll() { return this.therapyAreaService.findAllAdmin(); }

  @Post() @ApiOperation({ summary: 'Create therapy area' }) @ApiBody({ type: CreateTherapyAreaDto })
  create(@Body() dto: CreateTherapyAreaDto) { return this.therapyAreaService.create(dto); }

  @Patch(':id') @ApiOperation({ summary: 'Update therapy area' }) @ApiParam({ name: 'id' }) @ApiBody({ type: UpdateTherapyAreaDto })
  update(@Param('id') id: string, @Body() dto: UpdateTherapyAreaDto) { return this.therapyAreaService.update(id, dto); }

  @Delete(':id') @ApiOperation({ summary: 'Delete therapy area' }) @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) { return this.therapyAreaService.remove(id); }
}
