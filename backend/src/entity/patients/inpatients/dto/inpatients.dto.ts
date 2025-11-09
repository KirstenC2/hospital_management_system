import { PatientType } from "../../patient.type";

export class CreatePatientDto {
    name: string;
    gender: string;
    age: number;
    contactNumber: string;
    admissionDate: Date;
    diagnosis: string;
    careLevel: string;
    bedId?: number;
    isActive: boolean;
    patientType: PatientType;
    status: string;
}

export class GetPatientListDto {
    id: number;
    name: string;
    bedId: number;
    contactNumber: string;
    isActive: boolean;
    patientType: PatientType;
    status: string;
}
    