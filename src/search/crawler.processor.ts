import * as cheerio from 'cheerio';
import { CrawlData, Links, PageData, ParsedBody } from './dto/crawler.dto';
import { Browser } from 'puppeteer';

const isSameHost = (link: URL | string, base: URL | string) => {
  return new URL(link).host === new URL(base).host;
};

const getLinks = async ($: cheerio.CheerioAPI, url: URL): Promise<Links> => {
  const interalLinks: string[] = [];
  const externalLinks: string[] = [];

  const links = $('a');
  links.each((i, element) => {
    const href = $(element).attr('href');
    const parsedUrl = new URL(href, url);

    if (
      !parsedUrl ||
      parsedUrl.hash || // Skip URLs starting with #
      parsedUrl.protocol.startsWith('mailto') || // Skip mailto links
      parsedUrl.protocol.startsWith('tel') || // Skip tel links
      parsedUrl.protocol.startsWith('javascript') || // Skip javascript links
      parsedUrl.pathname.endsWith('.pdf') || // Skip PDF files
      parsedUrl.pathname.endsWith('.md') // Skip markdown files
    ) {
      return;
    }

    if (parsedUrl.protocol) {
      if (isSameHost(parsedUrl.href, url.href)) {
        interalLinks.push(parsedUrl.href);
      } else {
        externalLinks.push(parsedUrl.href);
      }
    } else {
      interalLinks.push(parsedUrl.href);
    }
  });

  return new Links({ internal: interalLinks, external: externalLinks });
};

const getPageData = async ($: cheerio.CheerioAPI): Promise<PageData> => {
  const title = $('title').text() || '';
  const description = $('meta[name="description"]').attr('content') || '';
  return new PageData({ title, description });
};

const getPageHeadings = async ($: cheerio.CheerioAPI): Promise<string> => {
  const headings = [];

  $('h1').each((index, element) => {
    const headingText = $(element).text();
    if (headingText) {
      headings.push(headingText);
    }
  });

  return headings.join(', ');
};

const parseBody = async (body: string, url: URL): Promise<ParsedBody> => {
  const $ = cheerio.load(body);

  const start = performance.now();
  const links = await getLinks($, url);
  const titleAndDesc = await getPageData($);
  const headings = await getPageHeadings($);
  const end = performance.now();

  return new ParsedBody({
    crawlTime: end - start,
    links,
    description: titleAndDesc.description,
    title: titleAndDesc.title,
    headings,
  });
};

const Crawl = async (
  browser: Browser,
  urlString: string,
): Promise<CrawlData> => {
  const page = await browser.newPage();
  try {
    const url = new URL(urlString);

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url() === url.href, {
        timeout: 90_000,
      }),
      page.goto(url.href, { waitUntil: 'networkidle2' }),
    ]);

    if (response.status() != 200) {
      return new CrawlData({
        url: urlString,
        responseCode: response.status(),
        success: false,
      });
    }

    const contentType = response.headers()['content-type'];
    if (contentType.includes('text/html')) {
      const pageContent = await page.content();
      const parsedBody = await parseBody(pageContent, url);
      return new CrawlData({
        url: urlString,
        responseCode: response.status(),
        success: true,
        parsedBody,
      });
    } else {
      return new CrawlData({
        url: urlString,
        responseCode: response.status(),
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    return new CrawlData({
      url: urlString,
      responseCode: 0,
      success: false,
    });
  } finally {
    await page.close();
  }
};

export default Crawl;
