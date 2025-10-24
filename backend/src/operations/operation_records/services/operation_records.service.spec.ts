import { Test, TestingModule } from '@nestjs/testing';
import { OperationRecordsService } from '../services/operation_records.service';

describe('OperationRecordsService', () => {
  let service: OperationRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationRecordsService],
    }).compile();

    service = module.get<OperationRecordsService>(OperationRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
