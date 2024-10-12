import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchIndexService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SearchIndexUncheckedCreateInput) {
    return this.prisma.searchIndex.create({ data });
  }

  async upsert(args: Prisma.SearchIndexUpsertArgs) {
    return this.prisma.searchIndex.upsert(args);
  }

  async fullTextSearch(value: string) {
    const terms = value.split(' ');
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
