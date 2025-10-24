import { Module } from '@nestjs/common';
import { OperationRecordsService } from './services/operation_records.service';
import { OperationRecordsController } from './controllers/operation_records.controller';
import { OperationRecordsRepository } from './repositories/operation_records.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { OperationRecords } from './entities/operation_records.entity';

@Module({
  imports: [SequelizeModule.forFeature([OperationRecords])],
  controllers: [OperationRecordsController],
  providers: [OperationRecordsService, OperationRecordsRepository],
  exports: [OperationRecordsService],
})
export class OperationRecordsModule {}
