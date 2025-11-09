import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InPatient } from '../entities/inpatients.entity';
import { CreatePatientDto } from '../dto/inpatients.dto';
    
@Injectable()
export class InPatientsRepository {
    constructor(
        @InjectModel(InPatient)
        private readonly inpatientModel: typeof InPatient
    ){}

    async getAllPatients(): Promise<any[]> {
        return this.inpatientModel.findAll();
    }

    async createPatient(createPatientDto: CreatePatientDto): Promise<InPatient> {
        return this.inpatientModel.create(createPatientDto as any);
    }
}
