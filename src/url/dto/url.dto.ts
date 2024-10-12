import { ApiHideProperty } from '@nestjs/swagger';
import { CrawledUrl } from '@prisma/client';
import { Expose } from 'class-transformer';

export class CrawledUrlResponseDto implements CrawledUrl {
  @ApiHideProperty()
  id: string;

  @Expose()
  url: string;

  @ApiHideProperty()
  success: boolean;

  @Expose()
  crawlDuration: number;

  @ApiHideProperty()
  responseCode: number;

  @Expose()
  pageTitle: string;
  @Expose()
  pageDescription: string;

  @Expose()
  heading: string;

  @Expose()
  lastTested: Date;

  @ApiHideProperty()
  indexed: boolean;

  @ApiHideProperty()
  createdAt: Date;

  @ApiHideProperty()
  updatedAt: Date;

  @ApiHideProperty()
  deletedAt: Date;

  constructor(partial: Partial<CrawledUrlResponseDto> | Partial<CrawledUrl>) {
    Object.assign(this, partial);
  }
}
