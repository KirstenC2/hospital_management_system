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

    async update(id: string, status: string): Promise<string> {
        console.log("-------------", status);
        return await this.appointmentRepository.update(id, status);
    }

    async findById(id: number): Promise<Appointment | null> {
        return await this.appointmentRepository.findById(id);
    }

    async create(appointment: Appointment): Promise<Appointment> {
        return await this.appointmentRepository.create(appointment);
    }
}
