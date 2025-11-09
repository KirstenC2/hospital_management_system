import { Test, TestingModule } from '@nestjs/testing';
import { InPatientsController } from './inpatients.controller';
import { InPatientsService } from '../../inpatients/services/inpatients.service';

describe('InPatientsController', () => {
  let controller: InPatientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InPatientsController],
      providers: [InPatientsService],
    }).compile();

    controller = module.get<InPatientsController>(InPatientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
