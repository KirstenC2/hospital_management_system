import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InPatient } from '../entities/inpatients.entity';
import { CreatePatientDto } from '../dto/inpatients.dto';
import { Patient } from 'src/entity/patients/entities/patients.entity';  
@Injectable()
export class InPatientsRepository {
    constructor(
        @InjectModel(InPatient)
        private readonly inpatientModel: typeof InPatient
    ){}

    async getAllPatients(): Promise<any[]> {
        return this.inpatientModel.findAll();
    }

    async getPatientRecordList(patientId: number): Promise<any[]> {
        return this.inpatientModel.findAll({ where: { patientId } });
    }

    async createInpatientRecord(createPatientDto: CreatePatientDto): Promise<InPatient> {
        return this.inpatientModel.create(createPatientDto as any);
    }

    async getPatientsByDoctorId(doctorId: number): Promise<InPatient[]> {
        return this.inpatientModel.findAll({
            include: [Patient],
            where: { doctorId } });
    }
}
