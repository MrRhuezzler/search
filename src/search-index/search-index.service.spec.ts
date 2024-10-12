import { Test, TestingModule } from '@nestjs/testing';
import { SearchIndexService } from './search-index.service';

describe('SearchIndexService', () => {
  let service: SearchIndexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchIndexService],
    }).compile();

    service = module.get<SearchIndexService>(SearchIndexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
