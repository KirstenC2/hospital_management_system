import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Patient } from '../entities/patients.entity';
import { CreatePatientDto } from '../dto/patients.dto';
import { UpdatePatientDto } from '../dto/patients.dto';

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

    async getTotalPatientsCount(): Promise<number> {
        return this.patientModel.count();
    }

    async updatePatient(updatePatientDto: UpdatePatientDto): Promise<any> {
        return this.patientModel.update({
            name: updatePatientDto.name,
            gender: updatePatientDto.gender,
            age: updatePatientDto.age,
            birthDate: updatePatientDto.birthDate as Date,
            phone: updatePatientDto.phone,
            address: updatePatientDto.address,
            emergencyContact: updatePatientDto.emergencyContact,
            emergencyPhone: updatePatientDto.emergencyPhone
        }as Patient, {
            where: {
                id: updatePatientDto.id
            }
        });
    }
}
