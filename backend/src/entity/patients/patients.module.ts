import { Module } from '@nestjs/common';
import { PatientsService } from './services/patients.service';
import { PatientsController } from './controllers/patients.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Patient } from './entities/patients.entity';
import { PatientsRepository } from './repositories/patients.repository';
import { InPatientsController } from './inpatients/controllers/inpatients.controller';
import { BedsModule } from 'src/facilities/beds/beds.module';
import { InPatientsModule } from './inpatients/inpatients.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Patient]),
    BedsModule,
    InPatientsModule,
  ],
  controllers: [PatientsController, InPatientsController],
  providers: [PatientsService, PatientsRepository],
  exports: [PatientsService],
})
export class PatientsModule {}
