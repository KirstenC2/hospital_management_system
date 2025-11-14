import api from "./api";
import type { BasePatient } from "./patients_api";
import type { Doctor } from "./doctors_api";

export interface BaseAppointment {
    patientId: string;  // Changed to string for UUID
    doctorId: string;   // Changed to string for UUID
    appointmentDate: string; // Or Date if you want to handle date objects
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

export interface CreateAppointmentDto {
    patientId: string;
    doctorId: string;
    appointmentDate: string; // Or Date
    departmentId: number;
    notes?: string;
}

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
        return await api.put(`/appointments/update/${id}/${'cancelled'}`);
    }
    
    async confirmAppointment(id: string): Promise<Appointment> {
        return await api.put(`/appointments/update/${id}/${'confirmed'}`);
    }
    
    async completeAppointment(id: string): Promise<Appointment> {
        return await api.put(`/appointments/update/${id}/${'completed'}`);
    }
    
    async noShowAppointment(id: string): Promise<Appointment> {
        return await api.put(`/appointments/update/${id}/${'no_show'}`);
    }
    
    async getPatientRecordList(patientId: number): Promise<AppointmentResponse[]> {
        return await api.get(`/appointments/patient?patientId=${patientId}`);
    }

    async getTodayAppointmentsCount(): Promise<number> {
        return await api.get('/appointments/today-count');
    }
}

export default new AppointmentService();