import { Module } from '@nestjs/common';
import { PatientsService } from './services/patients.service';
import { PatientsController } from './controllers/patients.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Patient } from './entities/patients.entity';
import { PatientsRepository } from './repositories/patients.repository';

@Module({
  imports: [SequelizeModule.forFeature([Patient])],
  controllers: [PatientsController],
  providers: [PatientsService, PatientsRepository],
  exports: [PatientsService],
})
export class PatientsModule {}
