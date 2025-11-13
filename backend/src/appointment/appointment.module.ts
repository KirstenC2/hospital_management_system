import { Module } from '@nestjs/common';
import { AppointmentService } from './services/appointment.service';
import { AppointmentController } from './controllers/appointment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Appointment } from './entities/appointment.entity';
import { AppointmentRepository } from './repositories/appointment.repository';

@Module({
  imports: [SequelizeModule.forFeature([Appointment])],
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentRepository],
  exports: [AppointmentService],
})
export class AppointmentModule {}
