import { Controller, Get, Query } from '@nestjs/common';
import { SearchIndexService } from './search-index.service';
import { CrawledUrlResponseDto } from 'src/url/dto/url.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('search')
@ApiTags('search')
export class SearchIndexController {
  constructor(private readonly index: SearchIndexService) {}

  @Get()
  async search(@Query('q') searchTerm: string) {
    return (await this.index.fullTextSearch(searchTerm ?? '')).map(
      (url) => new CrawledUrlResponseDto(url),
    );
  }
}
