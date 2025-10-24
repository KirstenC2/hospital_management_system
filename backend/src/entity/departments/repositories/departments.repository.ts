import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from '../entities/departments.entity';
import { CreateDepartmentDto } from '../dto/create-department.dto';

@Injectable()
export class DepartmentsRepository {
    constructor(
        @InjectModel(Department)
        private departmentsModel: typeof Department,
    ) {}

    async findAll(): Promise<any> {
        return this.departmentsModel.findAll();
    }

    async findDepartmentList(): Promise<any> {
        return this.departmentsModel.findAll({ attributes: ['id', 'displayName'] });
    }

    async count(): Promise<number> {
        return this.departmentsModel.count();
    }

    async create(department: CreateDepartmentDto): Promise<any> {
        return this.departmentsModel.create(department as any);
    }
}
