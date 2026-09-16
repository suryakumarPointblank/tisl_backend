import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('api/v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search therapy areas, sub-sections, topics, and content items' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  async search(@Query('q') q: string) {
    return this.searchService.search(q ?? '');
  }
}
