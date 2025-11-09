import { Module } from '@nestjs/common';
import { SurgeryTypesService } from './services/surgery_types.service';
import { SurgeryTypesController } from './controllers/surgery_types.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SurgeryTypes } from '../surgery_types/entities/surgery_types.entity';
import { SurgeryTypesRepository } from '../surgery_types/repositories/surgery_types.repository';


@Module({
  imports: [SequelizeModule.forFeature([SurgeryTypes])],
  controllers: [SurgeryTypesController],
  providers: [SurgeryTypesService, SurgeryTypesRepository],
  exports: [SurgeryTypesService],
})
export class SurgeryTypesModule {}
