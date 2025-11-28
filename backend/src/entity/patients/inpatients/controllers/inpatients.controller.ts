import { Controller, Get, Post, Body, Query, Put } from '@nestjs/common';
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

  @Get('records')
  async getPatientRecordList(@Query('patient_id') patientId: number): Promise<any[]> {
    return await this.inpatientsService.getPatientRecordList(patientId);
  }

  @Post('new')
  async createInpatientRecord(@Body() createPatientDto: CreatePatientDto): Promise<InPatient> {
    return await this.inpatientsService.createInpatientRecord(createPatientDto);
  }

  @Put('discharge')
  async dischargePatient(@Query('id') id: number): Promise<any> {
    return await this.inpatientsService.dischargePatient(id);
  }

  @Get('doctor')
  async getPatientsByDoctorId(@Query('doctor_id') doctorId: number): Promise<InPatient[]> {
    return await this.inpatientsService.getPatientsByDoctorId(doctorId);
  }


}
