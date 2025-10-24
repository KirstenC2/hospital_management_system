import { Test, TestingModule } from '@nestjs/testing';
import { SurgeryRoomsController } from './surgery-rooms.controller';
import { SurgeryRoomsService } from '../services/surgery-rooms.service';

describe('SurgeryRoomsController', () => {
  let controller: SurgeryRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurgeryRoomsController],
      providers: [SurgeryRoomsService],
    }).compile();

    controller = module.get<SurgeryRoomsController>(SurgeryRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
