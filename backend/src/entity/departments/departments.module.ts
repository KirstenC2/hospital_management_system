import { Module } from '@nestjs/common';
import { DepartmentsService } from '../departments/services/departments.service';
import { DepartmentsController } from '../departments/controllers/departments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from '../departments/entities/departments.entity';
import { DepartmentsRepository } from '../departments/repositories/departments.repository';

@Module({
  imports: [SequelizeModule.forFeature([Department])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentsRepository],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
