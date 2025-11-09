import { Module } from '@nestjs/common';
import { InPatientsService } from './services/inpatients.service';
import { InPatientsController } from './controllers/inpatients.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { InPatient } from './entities/inpatients.entity';
import { InPatientsRepository } from './repositories/inpatients.repository';
import { BedsModule } from 'src/facilities/beds/beds.module';

@Module({
  imports: [
    SequelizeModule.forFeature([InPatient]),
    BedsModule  // Import BedsModule to get access to BedsService
  ],
  controllers: [InPatientsController],
  providers: [
    InPatientsService, 
    InPatientsRepository
  ],
  exports: [InPatientsService],
})
export class InPatientsModule {}
