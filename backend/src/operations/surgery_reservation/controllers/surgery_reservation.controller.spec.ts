import { Test, TestingModule } from '@nestjs/testing';
import { SurgeryReservationController } from '../controllers/surgery_reservation.controller';
import { SurgeryReservationService } from '../services/surgery_reservation.service';

describe('SurgeryReservationController', () => {
  let controller: SurgeryReservationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurgeryReservationController],
      providers: [SurgeryReservationService],
    }).compile();

    controller = module.get<SurgeryReservationController>(SurgeryReservationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
