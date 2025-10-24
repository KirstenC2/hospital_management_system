import { Test, TestingModule } from '@nestjs/testing';
import { OperationRecordsRepository } from '../repositories/operation_records.repository';

describe('OperationRecordsRepository', () => {
  let service: OperationRecordsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationRecordsRepository],
    }).compile();

    service = module.get<OperationRecordsRepository>(OperationRecordsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
