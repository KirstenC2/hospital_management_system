import { Controller, Get, Query } from '@nestjs/common';
import { PatientsService } from '../services/patients.service';
import { GetPatientListDto } from '../dto/patients.dto';


@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('list')
  async getAllPatients(): Promise<GetPatientListDto[]> {
    return await this.patientsService.getAllPatients();
  }

  @Get('info')
  async getPatientById(@Query('id') id: number) {
    return await this.patientsService.getPatientById(id);
  }
}
