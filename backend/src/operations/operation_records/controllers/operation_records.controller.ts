import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OperationRecordsService } from '../services/operation_records.service';
import { CreateOperationRecordsDto } from '../dto/operations_records.dto';

@Controller('operation-records')
export class OperationRecordsController {
  constructor(private readonly operationRecordsService: OperationRecordsService) {}

  @Get()
  async findAll() {
    return this.operationRecordsService.findAll();
  }

  @Get('total')
  async getTotal(@Query() status: string) {
    return this.operationRecordsService.getTotal(status);
  }

  @Post('new')
  async createOperationRecord(@Body() operationRecord: CreateOperationRecordsDto) {
    return this.operationRecordsService.createOperationRecord(operationRecord);
  }
}
