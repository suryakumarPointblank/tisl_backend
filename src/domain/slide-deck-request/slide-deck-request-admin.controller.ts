import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SlideDeckRequestService } from './slide-deck-request.service';

@ApiTags('Admin — Slide Deck Requests')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/slide-deck-requests')
export class SlideDeckRequestAdminController {
  constructor(private readonly slideDeckRequestService: SlideDeckRequestService) {}

  @Get()
  @ApiOperation({ summary: 'List all slide deck requests (admin)' })
  findAll() {
    return this.slideDeckRequestService.findAllAdmin();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update slide deck request status' })
  @ApiParam({ name: 'id' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string' } } } })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.slideDeckRequestService.updateStatus(id, body.status);
  }
}
