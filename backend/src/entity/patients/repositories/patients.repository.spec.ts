import { Test, TestingModule } from '@nestjs/testing';
import { PatientsRepository } from './patients.repository';

describe('PatientsRepository', () => {
  let service: PatientsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientsRepository],
    }).compile();

    service = module.get<PatientsRepository>(PatientsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
