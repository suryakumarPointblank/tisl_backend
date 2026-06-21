import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { FacultyService } from './faculty.service';

@ApiTags('Faculty')
@Controller('api/v1/faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active faculty' })
  findAll() {
    return this.facultyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get faculty by id' })
  @ApiParam({ name: 'id' })
  findById(@Param('id') id: string) {
    return this.facultyService.findById(id);
  }
}
