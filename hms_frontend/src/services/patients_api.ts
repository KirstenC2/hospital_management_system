
import api from './api';
// In your types file
export interface BasePatient {
    id: number;
    name: string;
    gender: string;
    age: number;
    phone: string;
    status: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
}

export interface Inpatient {
    id: number;
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

type Patient = BasePatient | Inpatient;

export interface OutPatients {
    id: string;
    name: string;
    gender: string;
    age: number;
    patientType: string;
    phone: string;
    contactNumber: string;
    status: string;
    diagnosis: string;
}


export interface CreateInPatientDto {
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

export interface CreateOutPatientDto {
    name: string;
    gender: string;
    age: number;
    phone: string;
    contactNumber: string;
    status: string;
    diagnosis: string;
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
    async getAllPatients(): Promise<Inpatient[]> {
        return await api.get('/patients/list');
    }

    async createPatient(createPatientDto: CreateInPatientDto): Promise<Patient> {
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
    
    async createInpatientRecord(createInpatientRecordDto: CreateInpatientRecordDto): Promise<any> {
        return await api.post('/inpatients/new', createInpatientRecordDto);
    }
}



export default new PatientsService();
