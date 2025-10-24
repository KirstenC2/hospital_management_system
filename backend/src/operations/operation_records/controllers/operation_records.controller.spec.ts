import { Test, TestingModule } from '@nestjs/testing';
import { OperationRecordsController } from './operation_records.controller';
import { OperationRecordsService } from './operation_records.service';

describe('OperationRecordsController', () => {
  let controller: OperationRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationRecordsController],
      providers: [OperationRecordsService],
    }).compile();

    controller = module.get<OperationRecordsController>(OperationRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
