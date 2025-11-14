import { Injectable } from '@nestjs/common';
import { PatientsRepository } from '../repositories/patients.repository';
import { CreatePatientDto } from '../dto/patients.dto';
import { UpdatePatientDto } from '../dto/patients.dto';

@Injectable()
export class PatientsService {
    constructor(
        private readonly patientsRepository: PatientsRepository
    ){}
    
    async getAllPatients(): Promise<any[]> {
        return this.patientsRepository.getAllPatients();
    }

    async getPatientById(id: number): Promise<any> {
        return this.patientsRepository.getPatientById(id);
    }

    async createPatient(createPatientDto: CreatePatientDto): Promise<any> {
        return this.patientsRepository.createPatient(createPatientDto);
    }

    async getTotalPatientsCount(): Promise<number> {
        return this.patientsRepository.getTotalPatientsCount();
    }

    async updatePatient(updatePatientDto: UpdatePatientDto): Promise<any> {
        return this.patientsRepository.updatePatient(updatePatientDto);
    }
}
