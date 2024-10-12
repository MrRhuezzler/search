import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async getNextCrawlUrls(limit: number) {
    return this.prisma.crawledUrl.findMany({
      where: {
        lastTested: null,
      },
      take: limit,
    });
  }

  async findMany(args: Prisma.CrawledUrlFindManyArgs) {
    return this.prisma.crawledUrl.findMany(args);
  }

  async update(args: Prisma.CrawledUrlUpdateArgs) {
    return this.prisma.crawledUrl.update(args);
  }

  async updateMany(args: Prisma.CrawledUrlUpdateManyArgs) {
    return this.prisma.crawledUrl.updateMany(args);
  }

  async create(args: Prisma.CrawledUrlCreateArgs) {
    try {
      return this.prisma.crawledUrl.create(args);
    } catch (err) {
      return null;
    }
  }
}
