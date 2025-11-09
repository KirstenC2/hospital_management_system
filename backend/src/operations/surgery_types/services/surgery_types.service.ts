import { Injectable } from '@nestjs/common';
import { SurgeryTypesRepository } from '../repositories/surgery_types.repository';
import { CreateSurgeryTypesDto } from '../dto/create-surgery-types.dto';

@Injectable()
export class SurgeryTypesService {
    constructor(private readonly surgeryTypesRepository: SurgeryTypesRepository) {}

    async createSurgeryTypes(data: CreateSurgeryTypesDto): Promise<any> {
        return await this.surgeryTypesRepository.createSurgeryTypes(data);
    }
}
