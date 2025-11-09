// backend/src/entity/medical-records/controllers/medical-records.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { MedicalRecordsService } from './medical_records.service';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './dtos/medical_record.dto';
import { MedicalRecord } from './entities/medical_records.entity';

@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  create(@Body() createDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    return this.medicalRecordsService.create(createDto);
  }

  @Get()
  findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordsService.findAll();
  }

  @Get('patient')
  findByPatientId(@Query('patientId') patientId: string): Promise<MedicalRecord[]> {
    return this.medicalRecordsService.findByPatientId(parseInt(patientId));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MedicalRecord> {
    return this.medicalRecordsService.findOne(parseInt(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMedicalRecordDto,
  ): Promise<[number]> {
    return this.medicalRecordsService.update(parseInt(id), updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<number> {
    return this.medicalRecordsService.remove(parseInt(id));
  }
}