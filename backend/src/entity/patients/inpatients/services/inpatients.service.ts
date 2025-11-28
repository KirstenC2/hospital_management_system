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
        let create_result= await this.inpatientsRepository.createInpatientRecord(createPatientDto);
        if(createPatientDto.bedId) {
            await this.bedsService.updateBedStatus(createPatientDto.bedId, 4); // 4 is occupied
        }
        return create_result;
    }

    async dischargePatient(id: number): Promise<any> {
        let discharge_result= await this.inpatientsRepository.dischargePatient(id);
        if(discharge_result.dataValues.bedId) {
            await this.bedsService.updateBedStatus(discharge_result.dataValues.bedId, 1); // 1 is available
        }
        return discharge_result;
    }

    async getPatientsByDoctorId(doctorId: number): Promise<InPatient[]> {
        return this.inpatientsRepository.getPatientsByDoctorId(doctorId);
    }

}
