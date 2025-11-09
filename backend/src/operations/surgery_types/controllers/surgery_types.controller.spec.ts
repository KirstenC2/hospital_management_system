import { Test, TestingModule } from '@nestjs/testing';
import { SurgeryTypesController } from '../controllers/surgery_types.controller';
import { SurgeryTypesService } from '../services/surgery_types.service';

describe('SurgeryTypesController', () => {
  let controller: SurgeryTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurgeryTypesController],
      providers: [SurgeryTypesService],
    }).compile();

    controller = module.get<SurgeryTypesController>(SurgeryTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
