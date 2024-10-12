import { Test, TestingModule } from '@nestjs/testing';
import { AppProtectedController } from './app-protected.controller';

describe('AppProtectedController', () => {
  let controller: AppProtectedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppProtectedController],
    }).compile();

    controller = module.get<AppProtectedController>(AppProtectedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
