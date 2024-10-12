import { Module } from '@nestjs/common';
import { SearchIndexService } from './search-index.service';
import { SearchIndexController } from './search-index.controller';

@Module({
  providers: [SearchIndexService],
  exports: [SearchIndexService],
  controllers: [SearchIndexController],
})
export class SearchIndexModule {}
