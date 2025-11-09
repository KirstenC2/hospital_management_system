import { Module } from '@nestjs/common';
import { DoctorsService } from './services/doctors.service';
import { DoctorsController } from './controllers/doctors.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Doctors } from './entities/doctors.entity';
import { DoctorsRepository } from './repositories/doctors.repository';

@Module({
  imports: [SequelizeModule.forFeature([Doctors])],
  controllers: [DoctorsController],
  providers: [DoctorsService, DoctorsRepository],
  exports: [DoctorsService],
})
export class DoctorsModule {}
