import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Patient } from '../entities/patients.entity';

@Injectable()
export class PatientsRepository {
    constructor(
        @InjectModel(Patient)
        private readonly patientModel: typeof Patient
    ){}

    async getAllPatients(): Promise<any[]> {
        return this.patientModel.findAll();
    }

    async getPatientById(id: number): Promise<any> {
        return this.patientModel.findByPk(id);
    }
}
