import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOperationRecordsDto } from '../dto/operations_records.dto';
import { OperationRecords } from '../entities/operation_records.entity';
@Injectable()
export class OperationRecordsRepository {
    constructor(
        @InjectModel(OperationRecords)
        private operationRecordsModel: typeof OperationRecords,
    ){}

    async findAll(): Promise<CreateOperationRecordsDto[]> {
        return this.operationRecordsModel.findAll();
    }

    async getTotal(status: string): Promise<number> {
        return this.operationRecordsModel.count({ where: { status } });
    }

    async createOperationRecord(operationRecord: CreateOperationRecordsDto): Promise<CreateOperationRecordsDto> {
        return this.operationRecordsModel.create(operationRecord as any);
    }
}
