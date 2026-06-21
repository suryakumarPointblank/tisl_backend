import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TopicService } from './topic.service';

@ApiTags('Topics')
@Controller('api/v1/topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  @ApiOperation({ summary: 'Get topics by sub-section' })
  @ApiQuery({ name: 'subSectionId', required: true })
  findBySubSection(@Query('subSectionId') subSectionId: string) {
    return this.topicService.findBySubSection(subSectionId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get topic by slug' })
  @ApiParam({ name: 'slug', example: 'ptca-techniques' })
  findBySlug(@Param('slug') slug: string) {
    return this.topicService.findBySlug(slug);
  }
}
