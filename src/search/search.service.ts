import { Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import Crawl from './crawler.processor';
import { AppService } from 'src/app.service';
import { UrlService } from 'src/url/url.service';
import { Browser } from 'puppeteer';
import { InjectBrowser } from 'nestjs-puppeteer';
import { CrawledUrl } from '@prisma/client';
import analyze from './tokenizer.processor';
import { SearchIndexService } from 'src/search-index/search-index.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { chunk } from 'lodash';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private memIndex: Map<string, Set<string>> = new Map();

  constructor(
    private app: AppService,
    private url: UrlService,
    private index: SearchIndexService,
    private prisma: PrismaService,
    @InjectBrowser() private readonly browser: Browser,
  ) {}

  async addDocuments(docs: CrawledUrl[]): Promise<void> {
    docs.forEach((doc) => {
      const tokens = analyze(
        `${doc.url} ${doc.pageTitle} ${doc.pageDescription} ${doc.heading}`,
      );
      tokens.forEach((token) => {
        if (!this.memIndex.has(token)) {
          this.memIndex.set(token, new Set());
        }
        this.memIndex.get(token)?.add(doc.id);
      });
    });
  }

  // @Timeout(2000)
  @Cron('20 * * * *')
  async indexEngine() {
    this.logger.verbose('Indexing started');
    const docs = await this.url.findMany({
      where: {
        indexed: false,
        lastTested: {
          not: null,
        },
      },
    });

    await this.addDocuments(docs);

    const indexUrls = [];

    for (const [token, urlSet] of this.memIndex.entries()) {
      const urlIds = Array.from(urlSet);
      indexUrls.push(...urlIds);
      try {
        await this.index.upsert({
          create: {
            value: token,
            urls: {
              create: urlIds.map((urlId) => ({
                urlId, // Each associated URL ID
              })),
            },
          },
          update: {
            urls: {
              create: urlIds.map((urlId) => ({
                urlId, // Each associated URL ID
              })),
            },
          },
          where: {
            value: token,
          },
        });
      } catch (err) {}
    }

    const chunckedUrls = chunk(indexUrls, 32000);
    const transactions = chunckedUrls.map((ids) => {
      return this.prisma.crawledUrl.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          indexed: true,
        },
      });
    });

    await this.prisma.$transaction(transactions);
    this.logger.verbose('Indexing completed');
  }

  // @Timeout(2000)
  @Cron('0 * * * *')
  async crawlEngine() {
    this.logger.verbose('Crawling started');
    const settings = await this.app.getSettings();
    if (!settings.searchOn) {
      this.logger.verbose('Search is off');
      return;
    }

    const testedTime = new Date();
    const newUrls: string[] = [];

    const crawlUrls = await this.url.getNextCrawlUrls(settings.amount);

    for (const crawlUrl of crawlUrls) {
      const result = await Crawl(this.browser, crawlUrl.url);
      if (result.success) {
        newUrls.push(...(result?.parsedBody?.links.external ?? []));
        newUrls.push(...(result?.parsedBody?.links.internal ?? []));
      }

      await this.url.update({
        data: {
          success: result.success,
          crawlDuration: result.parsedBody?.crawlTime ?? 0,
          responseCode: result.responseCode,
          pageTitle: result.parsedBody?.title ?? '',
          pageDescription: result.parsedBody?.description ?? '',
          heading: result.parsedBody?.headings ?? '',
          lastTested: testedTime,
        },
        where: {
          id: crawlUrl.id,
        },
      });
    }

    if (!settings.addNew) {
      return;
    }

    try {
      const promises = newUrls.map(async (newUrl) =>
        this.url.create({
          data: {
            url: newUrl,
          },
        }),
      );
      await Promise.all(promises);
    } catch {}

    this.logger.verbose('Crawling completed');
  }
}
