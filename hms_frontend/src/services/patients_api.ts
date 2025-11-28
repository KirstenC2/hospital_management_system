
import api from './api';
// In your types file
export interface BasePatient {
    id: number;
    name: string;
    gender: string;
    age: number;
    phone: string;
    birthDate?: string;
    status: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
}

export interface InpatientPatientRecords {
    id: number;
    patientId: number;
    doctorId: number;
    bedId?: number;
    admissionDate: string;
    expectedDischargeDate: string;
    diagnosis: string;
    chiefComplaint?: string;
    medicalHistory?: string;
    treatmentPlan?: string;
    admissionNotes?: string;
    status?: 'waiting' | 'inpatient' | 'discharged' | 'transferred';
    createdAt?: string;
    updatedAt?: string;
}
;

export interface OutPatientsEncounters {
    name: string;
    gender: string;
    age: number;
    birthDate?: string;
    phone?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}


export interface CreatePatientDto {
    name: string;
    gender: string;
    age: number;
    birthDate?: string;
    phone?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateInpatientRecordDto {
    patientId: number;
    doctorId: number;
    bedId?: number;
    admissionDate: string;
    expectedDischargeDate: string;
    diagnosis: string;
    chiefComplaint?: string;
    medicalHistory?: string;
    treatmentPlan?: string;
    admissionNotes?: string;
    status?: 'waiting' | 'inpatient' | 'discharged' | 'transferred';
}

class PatientsService {
    // 获取所有患者
    async getAllPatients(params?: { departmentId?: number }): Promise<BasePatient[]> {
        return await api.get('/patients/list', { params });
    }

    async createPatient(createPatientDto: CreatePatientDto): Promise<BasePatient> {
        return await api.post('/patients/new', createPatientDto);
    }

    async getPatientById(id: number): Promise<BasePatient> {
        return await api.get(`/patients/info?id=${id}`);
    }

    async getMedicalRecordsByPatientId(id: number): Promise<any> {
        return await api.get(`/medical-records/patient?patientId=${id}`);
    }

    async getPatientRecordList(patientId: number): Promise<any> {
        return await api.get(`/inpatients/records?patient_id=${patientId}`);
    }

    async dischargePatient(id: number): Promise<any> {
        return await api.put(`/inpatients/discharge?id=${id}`);
    }
    
    async createInpatientRecord(createInpatientRecordDto: CreateInpatientRecordDto): Promise<any> {
        return await api.post('/inpatients/new', createInpatientRecordDto);
    }

    async updatePatient(patient: BasePatient): Promise<BasePatient> {
        return await api.put(`/patients/update?id=${patient.id}`, patient);
    }

    async getPatientsByDoctorId(id: number): Promise<BasePatient[]> {
        return await api.get(`/inpatients/doctor?doctor_id=${id}`);
    }

    async getTotalPatientsCount(): Promise<number> {
        return await api.get('/patients/total-count');
    }
}



export default new PatientsService();
