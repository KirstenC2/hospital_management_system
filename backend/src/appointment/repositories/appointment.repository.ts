import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Appointment } from '../entities/appointment.entity';
import { Patient } from 'src/entity/patients/entities/patients.entity';
import { Doctors } from 'src/entity/doctors/entities/doctors.entity';
import { AppointmentStatus } from '../enum/appointment-status.enum';
import { Department } from 'src/entity/departments/entities/departments.entity';
import { Op } from 'sequelize';
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

    async getTodayAppointmentsCount(): Promise<number> {
        return await this.appointmentModel.count({
            where: {
                appointmentDate: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
                    [Op.lt]: new Date(new Date().setHours(23, 59, 59, 999))
                }
            }
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

    async update(id: string, status: string): Promise<string> {
        if (status === 'cancelled') {
            let result = await this.appointmentModel.update({ 
                status: AppointmentStatus.CANCELLED,
                cancelledAt: new Date(),
                updatedAt: new Date()
             }, { where: { id } });
            if(result[0] === 0){
                throw new Error('Appointment not found');
            }
            return 'Appointment cancelled successfully';
        }else if (status === 'confirmed') {
            let result = await this.appointmentModel.update({ 
                status: AppointmentStatus.CONFIRMED,
                confirmedAt: new Date(),
                updatedAt: new Date()
             }, { where: { id } });
            if(result[0] === 0){
                throw new Error('Appointment not found');
            }
            return 'Appointment confirmed successfully';
        }else if (status === 'completed') {
            let result = await this.appointmentModel.update({ 
                status: AppointmentStatus.COMPLETED,
                completedAt: new Date(),
                updatedAt: new Date()
             }, { where: { id } });
            if(result[0] === 0){
                throw new Error('Appointment not found');
            }
            return 'Appointment completed successfully';
        }else if (status === 'no_show') {
            let result = await this.appointmentModel.update({ 
                status: AppointmentStatus.NO_SHOW,
                updatedAt: new Date()
             }, { where: { id } });
            if(result[0] === 0){
                throw new Error('Appointment not found');
            }
            return 'Appointment no show successfully';
        }
        return 'Appointment status updated successfully';
    }
}
