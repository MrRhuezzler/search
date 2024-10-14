import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import analyze, {
  analyzeWithoutStemming,
} from 'src/search/tokenizer.processor';

@Injectable()
export class SearchIndexService {
  private readonly logger = new Logger(SearchIndexService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SearchIndexUncheckedCreateInput) {
    return this.prisma.searchIndex.create({ data });
  }

  async upsert(args: Prisma.SearchIndexUpsertArgs) {
    return this.prisma.searchIndex.upsert(args);
  }

  async fullTextSearch(value: string) {
    const termsWithStemming = analyze(value);
    const termsWithoutStemmed = analyzeWithoutStemming(value);
    const terms = [...termsWithStemming, ...termsWithoutStemmed];

    let urls = [];

    for (const term of terms) {
      // Perform the search query using Prisma
      const searchIndexes = await this.prisma.searchIndex.findMany({
        where: {
          value: {
            contains: term,
          },
        },
        include: {
          urls: {
            include: {
              url: true,
            },
          },
        },
      });

      for (const searchIndex of searchIndexes) {
        urls = urls.concat(
          searchIndex.urls
            .filter((url) => url.url.success)
            .map((url) => url.url),
        );
      }
    }

    return urls;
  }
}
