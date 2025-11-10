import { Injectable } from '@nestjs/common';
import { GetPatientListDto, CreatePatientDto } from '../dto/inpatients.dto';
import { InPatientsRepository } from '../repositories/inpatients.repository';
import { InPatient } from '../entities/inpatients.entity';
import { BedsService } from 'src/facilities/beds/services/beds.service';

@Injectable()
export class InPatientsService {

    constructor(
        private readonly inpatientsRepository: InPatientsRepository,
        private readonly bedsService: BedsService
    ) {}
    
    async getAllPatients(): Promise<GetPatientListDto[]> {
        return this.inpatientsRepository.getAllPatients();
    }

    async getPatientRecordList(patientId: number): Promise<any[]> {
        return this.inpatientsRepository.getPatientRecordList(patientId);
    }

    async createInpatientRecord(createPatientDto: CreatePatientDto): Promise<InPatient> {
        if(createPatientDto.bedId) {
            const bed = await this.bedsService.getBedById(createPatientDto.bedId);
            if(bed.dataValues.statusId !== 1) {
                throw new Error('Bed is not available');
            }
        }
        return this.inpatientsRepository.createInpatientRecord(createPatientDto);
    }

}
