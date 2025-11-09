import { Controller, Post, Body } from '@nestjs/common';
import { SurgeryReservationService } from '../services/surgery_reservation.service';
import { CreateSurgeryReservationDto } from '../dto/surgery_reservation.dto';

@Controller('surgery-reservation')
export class SurgeryReservationController {
  constructor(private readonly surgeryReservationService: SurgeryReservationService) {}

  @Post()
  async createSurgeryReservation(@Body() data: CreateSurgeryReservationDto): Promise<any> {
    return await this.surgeryReservationService.createSurgeryReservation(data);
  }
}
