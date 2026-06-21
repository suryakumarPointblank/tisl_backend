import { Controller, Get, Post, Param, Query, Body, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ContentItemService } from './content-item.service.js';
import { OptionalJwtGuard } from '../../common/guards/optional-jwt.guard.js';
import { GetUser } from '../../common/decorators/get-user.decorator.js';

@ApiTags('Content Items')
@Controller('api/v1/content-items')
export class ContentItemController {
  constructor(@Inject(ContentItemService) contentItemService) {
    this.contentItemService = contentItemService;
  }

  @Get()
  @ApiOperation({ summary: 'Get content items by topic' })
  @ApiQuery({ name: 'topicId', required: true })
  @ApiQuery({ name: 'contentType', required: false })
  findByTopic(
    @Query('topicId') topicId,
    @Query('contentType') contentType,
  ) {
    return this.contentItemService.findByTopic(topicId, { contentType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content item by id' })
  @ApiParam({ name: 'id' })
  findById(@Param('id') id) {
    return this.contentItemService.findById(id);
  }

  @Post(':id/view')
  @UseGuards(OptionalJwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Record a content item view' })
  @ApiParam({ name: 'id' })
  recordView(
    @Param('id') id,
    @GetUser() user,
    @Body('sessionId') sessionId,
    @Body('therapyAreaId') therapyAreaId,
  ) {
    return this.contentItemService.recordView(
      user ? user.id : null,
      sessionId,
      therapyAreaId,
      id,
    );
  }
}
