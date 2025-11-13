import api from "./api";
import type { BasePatient } from "./patients_api";
import type { Doctor } from "./doctors_api";

export interface BaseAppointment {
    patientId: number;
    doctorId: number;
    appointmentDate: string;
    status: string;
    departmentId: number;
    notes?: string;
}

export interface AppointmentResponse{
    id: number;
    patient: BasePatient;
    doctor: Doctor;
    appointmentDate: string;
    status: string;
    departmentId: number;
    notes?: string;
    confirmedAt?: string;
    cancelledAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}


export interface Appointment extends BaseAppointment {
    id: number;
    patient: BasePatient;
    doctor: Doctor;
    appointmentDate: string;
    status: string;
    departmentId: number;
    notes?: string;
    confirmedAt?: string;
    cancelledAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateAppointmentDto = Omit<Appointment, 'id'>;

class AppointmentService {
    async getAllAppointments(): Promise<AppointmentResponse[]> {
        return await api.get('/appointments/all');
    }

    async getAppointmentById(id: string): Promise<AppointmentResponse> {
        return await api.get(`/appointments/${id}`);
    }

    async createAppointment(appointment: CreateAppointmentDto): Promise<Appointment> {
        return await api.post('/appointments', appointment);
    }

    async cancelAppointment(id: string): Promise<Appointment> {
        return await api.put(`/appointments/${id}/cancel`);
    }
    
    async getPatientRecordList(patientId: number): Promise<AppointmentResponse[]> {
        return await api.get(`/appointments/patient?patientId=${patientId}`);
    }
}

export default new AppointmentService();