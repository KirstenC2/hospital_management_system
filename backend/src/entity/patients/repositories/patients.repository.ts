import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Patient } from '../entities/patients.entity';
import { CreatePatientDto } from '../dto/patients.dto';

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

    async createPatient(createPatientDto: CreatePatientDto): Promise<any> {
        return this.patientModel.create({
            name: createPatientDto.name,
            gender: createPatientDto.gender,
            age: createPatientDto.age,
            birthDate: createPatientDto.birthDate as Date,
            phone: createPatientDto.phone,
            address: createPatientDto.address,
            emergencyContact: createPatientDto.emergencyContact,
            emergencyPhone: createPatientDto.emergencyPhone
        }as Patient);
    }
}
