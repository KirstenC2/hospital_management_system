import { Module } from '@nestjs/common';
import { MedicalRecordsService } from './medical_records.service';
import { MedicalRecordsController } from './medical_records.controller';
import { MedicalRecord } from './entities/medical_records.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { MedicalRecordsRepository } from './repositories/medical_record.repository';

@Module({
  imports: [SequelizeModule.forFeature([MedicalRecord])],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService, MedicalRecordsRepository],
  exports: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
