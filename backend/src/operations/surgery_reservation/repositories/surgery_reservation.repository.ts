import { Injectable } from '@nestjs/common';
import { CreateSurgeryReservationDto } from '../dto/surgery_reservation.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SurgeryReservation } from '../entities/surgery_reservation.entity';

@Injectable()
export class SurgeryReservationRepository {
    constructor(
        @InjectModel(SurgeryReservation)
        private surgeryReservationRepository: typeof SurgeryReservation
    ) {} 

    async createSurgeryReservation(data: CreateSurgeryReservationDto): Promise<any> {
        return await this.surgeryReservationRepository.create(data as any);
    }
}
