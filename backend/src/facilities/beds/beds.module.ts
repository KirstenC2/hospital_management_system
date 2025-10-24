import { Module } from '@nestjs/common';
import { BedsService } from './services/beds.service';
import { BedsController } from './controllers/beds.controller';
import { BedStatusService } from './services/bed_status.service';
import { BedsRepository } from './repositories/beds.repository';
import { BedStatusRepository } from './repositories/bed_status.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bed } from './entities/beds.entity';
import { BedStatus } from './entities/beds_status.entity';
import { BedStatusController } from './controllers/bed_status.controller';

@Module({
  imports: [SequelizeModule.forFeature([Bed, BedStatus])],
  controllers: [BedsController, BedStatusController],
  providers: [
    BedsService, 
    BedStatusService, 
    BedsRepository, 
    BedStatusRepository
  ],
  exports: [
    BedsService, 
    BedStatusService,
  ]
})
export class BedsModule {}
