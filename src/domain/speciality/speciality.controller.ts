import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SpecialityService } from './speciality.service';

@ApiTags('Specialities')
@Controller('api/v1/specialities')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Get()
  @ApiOperation({ summary: 'List all active specialities' })
  findAll() {
    return this.specialityService.findAll();
  }
}
