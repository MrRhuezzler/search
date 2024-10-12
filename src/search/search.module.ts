import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { UrlModule } from 'src/url/url.module';
import { PuppeteerModule } from 'nestjs-puppeteer';
import { SearchIndexModule } from 'src/search-index/search-index.module';

@Module({
  imports: [
    UrlModule,
    PuppeteerModule.forRoot({
      headless: 'shell',
    }),
    SearchIndexModule,
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
