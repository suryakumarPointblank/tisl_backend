import { Controller, Post, Get, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserEntity } from '../user/user.entity';
import { UserFavoriteService } from './user-favorite.service';

@ApiTags('User Favorites')
@Controller('api/v1/user-favorites')
export class UserFavoriteController {
  constructor(private readonly userFavoriteService: UserFavoriteService) {}

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle save/unsave a content item' })
  toggle(
    @GetUser() user: UserEntity,
    @Body('contentItemId') contentItemId: string,
  ) {
    return this.userFavoriteService.toggle(user.id, contentItemId);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all saved content for current user' })
  getUserFavorites(@GetUser() user: UserEntity) {
    return this.userFavoriteService.getUserFavorites(user.id);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get save count for a content item' })
  @ApiQuery({ name: 'contentItemId', required: true })
  getFavoriteCount(@Query('contentItemId') contentItemId: string) {
    return this.userFavoriteService.getFavoriteCount(contentItemId);
  }
}
