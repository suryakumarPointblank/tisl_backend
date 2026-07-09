import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebinarInterestService } from './webinar-interest.service';
import { CreateWebinarInterestDto } from './dto/create-webinar-interest.dto';

@ApiTags('Webinar Interests')
@Controller('api/v1/webinar-interests')
export class WebinarInterestController {
  constructor(private readonly webinarInterestService: WebinarInterestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit webinar interest (no auth required)' })
  async create(@Body() dto: CreateWebinarInterestDto) {
    const entity = await this.webinarInterestService.create(dto);
    return { message: 'Interest registered. We will be in touch with confirmation details.', id: entity.id };
  }
}
