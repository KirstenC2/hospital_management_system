import { Controller } from '@nestjs/common';
import { PatientsService } from '../services/patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}
}
