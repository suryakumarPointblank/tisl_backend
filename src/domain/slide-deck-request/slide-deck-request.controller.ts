import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SlideDeckRequestService } from './slide-deck-request.service';
import { CreateSlideDeckRequestDto } from './dto/create-slide-deck-request.dto';

@ApiTags('Slide Deck Requests')
@Controller('api/v1/slide-deck-requests')
export class SlideDeckRequestController {
  constructor(private readonly slideDeckRequestService: SlideDeckRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request a slide deck' })
  async create(@Body() dto: CreateSlideDeckRequestDto) {
    const entity = await this.slideDeckRequestService.create(dto);
    return { message: 'Request received. The slide deck will be emailed within 1 working day.', requestId: entity.id };
  }
}
