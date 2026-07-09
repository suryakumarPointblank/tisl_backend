import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ContentItemService } from './content-item.service';
import { OptionalJwtGuard } from '../../common/guards/optional-jwt.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Content Items')
@Controller('api/v1/content-items')
export class ContentItemController {
  constructor(private readonly contentItemService: ContentItemService) {}

  @Get()
  @ApiOperation({ summary: 'Get content items by topic' })
  @ApiQuery({ name: 'topicId', required: true })
  @ApiQuery({ name: 'contentType', required: false })
  findByTopic(
    @Query('topicId') topicId: string,
    @Query('contentType') contentType?: string,
  ) {
    return this.contentItemService.findByTopic(topicId, { contentType });
  }

  @Get('history/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get viewing history for current user' })
  getMyHistory(@GetUser() user: { id: string }) {
    return this.contentItemService.getUserHistory(user.id);
  }

  @Get('by-faculty/:facultyId')
  @ApiOperation({ summary: 'Get content items by faculty' })
  @ApiParam({ name: 'facultyId' })
  findByFaculty(@Param('facultyId') facultyId: string) {
    return this.contentItemService.findByFaculty(facultyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content item by id' })
  @ApiParam({ name: 'id' })
  findById(@Param('id') id: string) {
    return this.contentItemService.findById(id);
  }

  @Post(':id/view')
  @UseGuards(OptionalJwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Record a content item view' })
  @ApiParam({ name: 'id' })
  recordView(
    @Param('id') id: string,
    @GetUser() user: { id: string } | null,
    @Body('sessionId') sessionId: string,
    @Body('therapyAreaId') therapyAreaId: string,
  ) {
    return this.contentItemService.recordView(
      user ? user.id : null,
      sessionId,
      therapyAreaId,
      id,
    );
  }
}
