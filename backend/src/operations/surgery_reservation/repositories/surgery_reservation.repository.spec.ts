import { Test, TestingModule } from '@nestjs/testing';
import { SurgeryReservationRepository } from './surgery_reservation.repository';

describe('SurgeryReservationRepository', () => {
  let service: SurgeryReservationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurgeryReservationRepository],
    }).compile();

    service = module.get<SurgeryReservationRepository>(SurgeryReservationRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
