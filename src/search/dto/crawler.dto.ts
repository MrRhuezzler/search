export class PageData {
  title: string;
  description: string;

  constructor(partial: Partial<PageData>) {
    Object.assign(this, partial);
  }
}

export class Links {
  internal: string[];
  external: string[];

  constructor(partial: Partial<Links>) {
    Object.assign(this, partial);
  }
}

export class ParsedBody {
  crawlTime: number;
  title: string;
  description: string;
  headings: string;
  links: Links;

  constructor(partial: Partial<ParsedBody>) {
    Object.assign(this, partial);
  }
}

export class CrawlData {
  url: string;
  success: boolean;
  responseCode: number;
  parsedBody?: ParsedBody;

  constructor(partial: Partial<CrawlData>) {
    Object.assign(this, partial);
  }
}
