import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentRepository } from '../repositories/appointment.repository';

describe('AppointmentRepository', () => {
  let service: AppointmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentRepository],
    }).compile();

    service = module.get<AppointmentRepository>(AppointmentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
