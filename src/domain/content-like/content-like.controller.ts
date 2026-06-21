import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ContentLikeService } from './content-like.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserEntity } from '../user/user.entity';

@ApiTags('Content Likes')
@Controller('api/v1/content-likes')
export class ContentLikeController {
  constructor(private readonly contentLikeService: ContentLikeService) {}

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle like for a content item or patient content' })
  toggleLike(
    @GetUser() user: UserEntity,
    @Body('contentItemId') contentItemId: string,
    @Body('patientContentId') patientContentId: string,
  ) {
    return this.contentLikeService.toggleLike(user.id, contentItemId, patientContentId);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get like count for a content item or patient content' })
  @ApiQuery({ name: 'contentItemId', required: false })
  @ApiQuery({ name: 'patientContentId', required: false })
  getLikeCount(
    @Query('contentItemId') contentItemId: string,
    @Query('patientContentId') patientContentId: string,
  ) {
    return this.contentLikeService.getLikeCount(contentItemId, patientContentId);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all likes for the current user' })
  getUserLikes(@GetUser() user: UserEntity) {
    return this.contentLikeService.getUserLikes(user.id);
  }
}
