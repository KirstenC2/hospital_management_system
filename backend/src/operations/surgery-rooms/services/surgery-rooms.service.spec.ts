import { Test, TestingModule } from '@nestjs/testing';
import { SurgeryRoomsService } from './surgery-rooms.service';

describe('SurgeryRoomsService', () => {
  let service: SurgeryRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurgeryRoomsService],
    }).compile();

    service = module.get<SurgeryRoomsService>(SurgeryRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
