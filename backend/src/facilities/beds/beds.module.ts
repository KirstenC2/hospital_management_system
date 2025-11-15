import { Module } from '@nestjs/common';
import { BedsService } from './services/beds.service';
import { BedsController } from './controllers/beds.controller';
import { BedStatusService } from './services/bed_status.service';
import { BedsRepository } from './repositories/beds.repository';
import { BedStatusRepository } from './repositories/bed_status.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bed } from './entities/beds.entity';
import { BedStatus } from './entities/beds_status.entity';
import { BedStatusController } from './controllers/bed_status.controller';
import { InPatient } from 'src/entity/patients/inpatients/entities/inpatients.entity';
import { Patient } from 'src/entity/patients/entities/patients.entity';
import { Department } from 'src/entity/departments/entities/departments.entity';

@Module({
  imports: [SequelizeModule.forFeature([Bed, BedStatus, InPatient, Patient, Department])],
  controllers: [BedsController, BedStatusController],
  providers: [
    BedsService, 
    BedStatusService, 
    BedsRepository, 
    BedStatusRepository
  ],
  exports: [
    BedsService, 
    BedStatusService,
  ]
})
export class BedsModule {}
