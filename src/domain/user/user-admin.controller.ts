import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserService } from './user.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@ApiTags('Admin — Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List all HCP users' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'role', required: false })
  findAll(@Query('status') status?: string, @Query('role') role?: string) {
    return this.userService.findAll({ status, role });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Dashboard user stats' })
  stats() {
    return this.userService.getDashboardStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status/role' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateUserStatusDto })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.userService.updateStatus(id, dto);
  }
}
