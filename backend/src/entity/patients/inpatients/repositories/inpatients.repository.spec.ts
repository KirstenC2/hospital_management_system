import { Test, TestingModule } from '@nestjs/testing';
import { InPatientsRepository } from './inpatients.repository';

describe('InPatientsRepository', () => {
  let service: InPatientsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InPatientsRepository],
    }).compile();

    service = module.get<InPatientsRepository>(InPatientsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
