import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { InPatientsService } from '../services/inpatients.service';
import { GetPatientListDto, CreatePatientDto } from '../dto/inpatients.dto';
import { InPatient } from '../entities/inpatients.entity';

@Controller('inpatients')
export class InPatientsController {
  constructor(private readonly inpatientsService: InPatientsService) {}

  @Get('list')
  async getAllPatients(): Promise<GetPatientListDto[]> {
    return await this.inpatientsService.getAllPatients();
  } 

  @Post('new')
  async createPatient(@Body() createPatientDto: CreatePatientDto): Promise<InPatient> {
    return await this.inpatientsService.createPatient(createPatientDto);
  }


}
