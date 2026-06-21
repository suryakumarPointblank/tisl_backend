import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@ApiTags('Admin — Topics')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/topics')
export class TopicAdminController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  @ApiOperation({ summary: 'List all topics (admin)' })
  findAll() {
    return this.topicService.findAllAdmin();
  }

  @Post()
  @ApiOperation({ summary: 'Create topic' })
  @ApiBody({ type: CreateTopicDto })
  create(@Body() dto: CreateTopicDto) {
    return this.topicService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update topic' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateTopicDto })
  update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.topicService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete topic' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.topicService.remove(id);
  }
}
