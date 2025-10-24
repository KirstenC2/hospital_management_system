import { Test, TestingModule } from '@nestjs/testing';
import { BedsRepository } from './beds.repository';

describe('BedsRepository', () => {
  let repository: BedsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BedsRepository],
    }).compile();

    repository = module.get<BedsRepository>(BedsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
