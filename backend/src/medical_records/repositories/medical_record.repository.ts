// backend/src/entity/medical-records/repositories/medical-records.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MedicalRecord } from '../entities/medical_records.entity';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from '../dtos/medical_record.dto';

@Injectable()
export class MedicalRecordsRepository {
  constructor(
    @InjectModel(MedicalRecord)
    private readonly medicalRecordModel: typeof MedicalRecord,
  ) {}

  async create(createDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    return this.medicalRecordModel.create({
      ...createDto,
      lastUpdated: new Date(),
    });
  }

  async findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordModel.findAll({
      include: ['patient', 'doctor'],
    });
  }

  async findById(id: number): Promise<MedicalRecord> {
    const record = await this.medicalRecordModel.findByPk(id, {
      include: ['patient', 'doctor'],
    });
    if (!record) {
      throw new Error(`Medical record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: number, updateDto: UpdateMedicalRecordDto): Promise<[number]> {
    return this.medicalRecordModel.update(
      {
        ...updateDto,
        lastUpdated: new Date(),
      },
      { where: { id } },
    );
  }

  async delete(id: number): Promise<number> {
    return this.medicalRecordModel.destroy({ where: { id } });
  }

  async findByPatientId(patientId: number): Promise<MedicalRecord[]> {
    return this.medicalRecordModel.findAll({
      where: { patientId },
      include: ['doctor'],
      order: [['admissionDate', 'DESC']],
    });
  }
}