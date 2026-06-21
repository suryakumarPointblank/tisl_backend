import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { WebinarService } from './webinar.service';
import { CreateWebinarDto } from './dto/create-webinar.dto';
import { UpdateWebinarDto } from './dto/update-webinar.dto';

@ApiTags('Admin — Webinars')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/webinars')
export class WebinarAdminController {
  constructor(private readonly webinarService: WebinarService) {}

  @Get()
  @ApiOperation({ summary: 'List all webinars (admin)' })
  findAll() {
    return this.webinarService.findAllAdmin();
  }

  @Post()
  @ApiOperation({ summary: 'Create webinar' })
  @ApiBody({ type: CreateWebinarDto })
  create(@Body() dto: CreateWebinarDto) {
    return this.webinarService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update webinar' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateWebinarDto })
  update(@Param('id') id: string, @Body() dto: UpdateWebinarDto) {
    return this.webinarService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete webinar' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.webinarService.remove(id);
  }
}
