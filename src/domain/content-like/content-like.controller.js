import { Controller, Post, Get, Body, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ContentLikeService } from './content-like.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { GetUser } from '../../common/decorators/get-user.decorator.js';

@ApiTags('Content Likes')
@Controller('api/v1/content-likes')
export class ContentLikeController {
  constructor(@Inject(ContentLikeService) contentLikeService) {
    this.contentLikeService = contentLikeService;
  }

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle like for a content item or patient content' })
  toggleLike(
    @GetUser() user,
    @Body('contentItemId') contentItemId,
    @Body('patientContentId') patientContentId,
  ) {
    return this.contentLikeService.toggleLike(user.id, contentItemId, patientContentId);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get like count for a content item or patient content' })
  @ApiQuery({ name: 'contentItemId', required: false })
  @ApiQuery({ name: 'patientContentId', required: false })
  getLikeCount(
    @Query('contentItemId') contentItemId,
    @Query('patientContentId') patientContentId,
  ) {
    return this.contentLikeService.getLikeCount(contentItemId, patientContentId);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all likes for the current user' })
  getUserLikes(@GetUser() user) {
    return this.contentLikeService.getUserLikes(user.id);
  }
}
