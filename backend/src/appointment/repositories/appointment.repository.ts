import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Appointment } from '../entities/appointment.entity';
import { Patient } from 'src/entity/patients/entities/patients.entity';
import { Doctors } from 'src/entity/doctors/entities/doctors.entity';
import { AppointmentStatus } from '../enum/appointment-status.enum';
import { Department } from 'src/entity/departments/entities/departments.entity';
@Injectable()
export class AppointmentRepository{

    constructor(
        @InjectModel(Appointment)
        private readonly appointmentModel: typeof Appointment 
    ){}

    async findAll(): Promise<Appointment[]> {
        return await this.appointmentModel.findAll({
            include: [Patient, Doctors]
        });
    }

    async getPatientRecordList(patientId: number): Promise<Appointment[]> {
        return await this.appointmentModel.findAll({
            where: { patientId },
            include: [Patient, Doctors, Department]
        });
    }

    async findById(id: number): Promise<Appointment | null> {
        return await this.appointmentModel.findByPk(id, {
            include: [Patient, Doctors]
        });
    }

    async create(appointment: Appointment): Promise<Appointment> {
        return await this.appointmentModel.create(appointment);
    }

    async cancel(id: string): Promise<string> {
        let result = await this.appointmentModel.update({ 
            status: AppointmentStatus.CANCELLED,
            cancelledAt: new Date(),
            updatedAt: new Date()
         }, { where: { id } });
        if(result[0] === 0){
            throw new Error('Appointment not found');
        }
        return 'Appointment cancelled successfully';
    }
}
