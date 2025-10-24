import { Injectable } from '@nestjs/common';
import { OperationRecordsRepository } from '../repositories/operation_records.repository';
import { CreateOperationRecordsDto } from '../dto/operations_records.dto';

@Injectable()
export class OperationRecordsService {
    constructor(private readonly operationRecordsRepository: OperationRecordsRepository) {}

    async findAll(): Promise<CreateOperationRecordsDto[]> {
        return this.operationRecordsRepository.findAll();
    }

    async getTotal(status: string): Promise<number> {
        return this.operationRecordsRepository.getTotal(status);
    }

    async createOperationRecord(operationRecord: CreateOperationRecordsDto): Promise<CreateOperationRecordsDto> {
        return this.operationRecordsRepository.createOperationRecord(operationRecord);
    }
}
