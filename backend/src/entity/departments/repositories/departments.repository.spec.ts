import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsRepository } from './departments.repository';

describe('DepartmentsRepository', () => {
  let service: DepartmentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentsRepository],
    }).compile();

    service = module.get<DepartmentsRepository>(DepartmentsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
