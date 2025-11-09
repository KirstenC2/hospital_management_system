import { Test, TestingModule } from '@nestjs/testing';
import { SurgeryReservationService } from './surgery_reservation.service';

describe('SurgeryReservationService', () => {
  let service: SurgeryReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurgeryReservationService],
    }).compile();

    service = module.get<SurgeryReservationService>(SurgeryReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
