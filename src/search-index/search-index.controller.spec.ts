import { Test, TestingModule } from '@nestjs/testing';
import { SearchIndexController } from './search-index.controller';

describe('SearchIndexController', () => {
  let controller: SearchIndexController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchIndexController],
    }).compile();

    controller = module.get<SearchIndexController>(SearchIndexController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
