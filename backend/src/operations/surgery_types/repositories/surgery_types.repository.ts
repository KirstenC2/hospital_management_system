import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SurgeryTypes } from '../entities/surgery_types.entity';
import { CreateSurgeryTypesDto } from '../dto/create-surgery-types.dto';

@Injectable()
export class SurgeryTypesRepository {
    constructor(
        @InjectModel(SurgeryTypes)
        private surgeryTypesRepository: typeof SurgeryTypes
    ) {}

    async createSurgeryTypes(data: CreateSurgeryTypesDto): Promise<any> {
        return await this.surgeryTypesRepository.create(data as any);
    }
}
