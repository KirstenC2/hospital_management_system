// backend/src/entity/medical-records/services/medical-records.service.ts
import { Injectable } from '@nestjs/common';
import { MedicalRecordsRepository } from './repositories/medical_record.repository';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './dtos/medical_record.dto';
import { MedicalRecord } from './entities/medical_records.entity';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly medicalRecordsRepository: MedicalRecordsRepository) {}

  async create(createDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    return this.medicalRecordsRepository.create(createDto);
  }

  async findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordsRepository.findAll();
  }

  async findOne(id: number): Promise<MedicalRecord> {
    return this.medicalRecordsRepository.findById(id);
  }

  async update(id: number, updateDto: UpdateMedicalRecordDto): Promise<[number]> {
    return this.medicalRecordsRepository.update(id, updateDto);
  }

  async remove(id: number): Promise<number> {
    return this.medicalRecordsRepository.delete(id);
  }

  async findByPatientId(patientId: number): Promise<MedicalRecord[]> {
    return this.medicalRecordsRepository.findByPatientId(patientId);
  }
}