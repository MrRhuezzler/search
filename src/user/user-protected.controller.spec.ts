import { Test, TestingModule } from '@nestjs/testing';
import { UserProtectedController } from './user-protected.controller';

describe('UserProtectedController', () => {
  let controller: UserProtectedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProtectedController],
    }).compile();

    controller = module.get<UserProtectedController>(UserProtectedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
