import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ContentLikeService } from './content-like.service';

@ApiTags('Admin — Content Likes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/content-likes')
export class ContentLikeAdminController {
  constructor(private readonly contentLikeService: ContentLikeService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get like counts per content item (admin)' })
  getStats() {
    return this.contentLikeService.getContentLikeStats();
  }
}
