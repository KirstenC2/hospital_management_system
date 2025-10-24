import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsRepository } from '../repositories/doctors.repository';

describe('DoctorsRepository', () => {
  let service: DoctorsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorsRepository],
    }).compile();

    service = module.get<DoctorsRepository>(DoctorsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
