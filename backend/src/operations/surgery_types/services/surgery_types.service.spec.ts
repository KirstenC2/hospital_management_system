import { Test, TestingModule } from '@nestjs/testing';
import { SurgeryTypesService } from '../services/surgery_types.service';

describe('SurgeryTypesService', () => {
  let service: SurgeryTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurgeryTypesService],
    }).compile();

    service = module.get<SurgeryTypesService>(SurgeryTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
