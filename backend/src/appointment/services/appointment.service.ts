import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { Appointment } from '../entities/appointment.entity';

@Injectable()
export class AppointmentService {
    constructor(
        private readonly appointmentRepository: AppointmentRepository
    ) {}

    async findAll(): Promise<Appointment[]> {
        return await this.appointmentRepository.findAll();
    }

    async getPatientRecordList(patientId: number): Promise<Appointment[]> {
        return await this.appointmentRepository.getPatientRecordList(patientId);
    }

    async cancel(id: string): Promise<string> {
        return await this.appointmentRepository.cancel(id);
    }

    async findById(id: number): Promise<Appointment | null> {
        return await this.appointmentRepository.findById(id);
    }

    async create(appointment: Appointment): Promise<Appointment> {
        return await this.appointmentRepository.create(appointment);
    }
}
