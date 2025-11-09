import { Controller } from '@nestjs/common';
import { SurgeryTypesService } from '../services/surgery_types.service';

@Controller('surgery-types')
export class SurgeryTypesController {
  constructor(private readonly surgeryTypesService: SurgeryTypesService) {}
}
