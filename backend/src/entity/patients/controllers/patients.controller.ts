import { Controller, Get, Post, Body, Query, Put } from '@nestjs/common';
import { PatientsService } from '../services/patients.service';
import { GetPatientListDto } from '../dto/patients.dto';
import { CreatePatientDto } from '../dto/patients.dto';
import { UpdatePatientDto } from '../dto/patients.dto';  

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

  @Post('new')
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    return await this.patientsService.createPatient(createPatientDto);
  }

  @Put('update')
  async updatePatient(@Body() updatePatientDto: UpdatePatientDto) {
    return await this.patientsService.updatePatient(updatePatientDto);
  } 
}
