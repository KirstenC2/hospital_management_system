import { Controller, Get, Param, Post, Body, Put, Query } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../entities/appointment.entity';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('all')
  async findAll(): Promise<Appointment[]> {
    return await this.appointmentService.findAll();
  }

  @Get('patient')
  async getPatientRecordList(@Query('patientId') patientId: number): Promise<Appointment[]> {
    return await this.appointmentService.getPatientRecordList(patientId);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Appointment | null> {
    return await this.appointmentService.findById(id);
  }

  @Post()
  async create(@Body() appointment: Appointment): Promise<Appointment> {
    return await this.appointmentService.create(appointment);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string): Promise<string> {
    return await this.appointmentService.cancel(id);
  }
}
