import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@ApiTags('Admin — Faculty')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/faculty')
export class FacultyAdminController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  @ApiOperation({ summary: 'List all faculty (admin)' })
  findAll() {
    return this.facultyService.findAllAdmin();
  }

  @Post()
  @ApiOperation({ summary: 'Create faculty' })
  @ApiBody({ type: CreateFacultyDto })
  create(@Body() dto: CreateFacultyDto) {
    return this.facultyService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update faculty' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateFacultyDto })
  update(@Param('id') id: string, @Body() dto: UpdateFacultyDto) {
    return this.facultyService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete faculty' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.facultyService.remove(id);
  }
}
