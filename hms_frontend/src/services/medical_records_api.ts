import api from "./api";

export interface MedicalRecord {
    id: string
    patient: {
        name: string
        gender: string
        age: number
        phone: string
    },
    diagnosis: string
    symptoms?: string
    allergies?: string
    doctor: {
        name: string
        departmentId: string
    }
    status: 'active' | 'completed' | 'archived'
    priority: 'normal' | 'high'
    admissionDate: string
    lastUpdate: string
    updateBy?: string
    progressNotes: ProgressNote[]
}

export interface CreateMedicalRecordDto {
    patientId: string
    doctorId: string
    diagnosis: string
    symptoms?: string
    allergies?: string
    priority: 'normal' | 'high'
    admissionDate: string
    progressNotes: ProgressNote[]
}

export interface UpdateMedicalRecordDto {
    id: string
    patientId: string
    doctorId: string
    diagnosis: string
    symptoms?: string
    allergies?: string
    priority: 'normal' | 'high'
    admissionDate: string
    progressNotes: ProgressNote[]
}

export interface ProgressNote {
    id: string
    record_date:Date
    record_id: string
    doctor_id: string
    title: string
    description: string
}
class MedicalRecordService {

    async getAllMedicalRecords(): Promise<MedicalRecord[]> {
        return await api.get('/medical-records');
    }

    async getMedicalRecordById(id: string): Promise<MedicalRecord> {
        return await api.get(`/medical-records/info?id=${id}`);
    }
}

export default new MedicalRecordService();
