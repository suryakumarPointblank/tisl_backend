import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SubSectionService } from './sub-section.service';
import { CreateSubSectionDto } from './dto/create-sub-section.dto';
import { UpdateSubSectionDto } from './dto/update-sub-section.dto';

@ApiTags('Admin — Sub Sections')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/sub-sections')
export class SubSectionAdminController {
  constructor(private readonly subSectionService: SubSectionService) {}

  @Get()
  @ApiOperation({ summary: 'List all sub-sections (admin)' })
  findAll() {
    return this.subSectionService.findAllAdmin();
  }

  @Post()
  @ApiOperation({ summary: 'Create sub-section' })
  @ApiBody({ type: CreateSubSectionDto })
  create(@Body() dto: CreateSubSectionDto) {
    return this.subSectionService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update sub-section' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateSubSectionDto })
  update(@Param('id') id: string, @Body() dto: UpdateSubSectionDto) {
    return this.subSectionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete sub-section' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.subSectionService.remove(id);
  }
}
