import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ContentItemService } from './content-item.service';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';

@ApiTags('Admin â€” Content Items')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/content-items')
export class ContentItemAdminController {
  constructor(private readonly contentItemService: ContentItemService) {}

  @Get()
  @ApiOperation({ summary: 'List all content items (admin)' })
  findAll() {
    return this.contentItemService.findAllAdmin();
  }

  @Post()
  @ApiOperation({ summary: 'Create content item' })
  @ApiBody({ type: CreateContentItemDto })
  create(@Body() dto: CreateContentItemDto) {
    return this.contentItemService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update content item' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateContentItemDto })
  update(@Param('id') id: string, @Body() dto: UpdateContentItemDto) {
    return this.contentItemService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete content item' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.contentItemService.remove(id);
  }
}
