import { Module } from '@nestjs/common';
import { SurgeryReservationService } from './services/surgery_reservation.service';
import { SurgeryReservationController } from './controllers/surgery_reservation.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SurgeryReservation } from './entities/surgery_reservation.entity';
import { SurgeryReservationRepository } from './repositories/surgery_reservation.repository';

@Module({
  imports: [SequelizeModule.forFeature([SurgeryReservation])],
  controllers: [SurgeryReservationController],
  providers: [SurgeryReservationService, SurgeryReservationRepository],
  exports: [SurgeryReservationService]
})
export class SurgeryReservationModule {}
