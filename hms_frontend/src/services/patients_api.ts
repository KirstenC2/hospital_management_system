
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

export interface Inpatient extends BasePatient {
  bedId: number;
  patientType: 'INPATIENT';
  contactNumber: string;
  careLevel: string;
  diagnosis: string;
  admissionDate: string | Date;
  isActive: boolean;
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
    admissionDate: Date;
    diagnosis: string;
    careLevel: string;
    bedId: number;
    phone: string;
    contactNumber: string;
    status: string;
    isActive: boolean;
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

export interface MedicalRecord {
    id: string;
    diagnosis: string;
    symptoms: string;
    priority: string;
    status: string;
    doctor: {
        name: string;
        title: string;
    };
}
class PatientsService {
    // 获取所有患者
    async getAllPatients(): Promise<Inpatient[]> {
        return await api.get('/patients/list');
    }

    async createPatient(createPatientDto: CreateInPatientDto | CreateOutPatientDto): Promise<Patient> {
        return await api.post('/patients/new', createPatientDto);
    }

    async getPatientById(id: number): Promise<BasePatient> {
        return await api.get(`/patients/info?id=${id}`);
    }

    async getMedicalRecordsByPatientId(id: number): Promise<any> {
        return await api.get(`/medical-records/patient?patientId=${id}`);
    }
}

export default new PatientsService();
