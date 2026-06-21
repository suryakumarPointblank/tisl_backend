import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ConditionService } from './condition.service';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';

@ApiTags('Admin — Conditions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/conditions')
export class ConditionAdminController {
  constructor(private readonly conditionService: ConditionService) {}

  @Get()
  @ApiOperation({ summary: 'List all conditions (admin)' })
  findAll() {
    return this.conditionService.findAllAdmin();
  }

  @Post()
  @ApiOperation({ summary: 'Create condition' })
  @ApiBody({ type: CreateConditionDto })
  create(@Body() dto: CreateConditionDto) {
    return this.conditionService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update condition' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateConditionDto })
  update(@Param('id') id: string, @Body() dto: UpdateConditionDto) {
    return this.conditionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete condition' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.conditionService.remove(id);
  }
}
