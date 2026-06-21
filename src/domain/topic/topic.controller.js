import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TopicService } from './topic.service.js';

@ApiTags('Topics')
@Controller('api/v1/topics')
export class TopicController {
  constructor(topicService) {
    this.topicService = topicService;
  }

  @Get()
  @ApiOperation({ summary: 'Get topics by sub-section' })
  @ApiQuery({ name: 'subSectionId', required: true })
  findBySubSection(@Query('subSectionId') subSectionId) {
    return this.topicService.findBySubSection(subSectionId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get topic by slug' })
  @ApiParam({ name: 'slug', example: 'ptca-techniques' })
  findBySlug(@Param('slug') slug) {
    return this.topicService.findBySlug(slug);
  }
}
