import { Injectable } from '@nestjs/common';
import { DepartmentsRepository } from '../repositories/departments.repository';
import { Department } from '../entities/departments.entity';
import { CreateDepartmentDto } from '../dto/create-department.dto';

@Injectable()
export class DepartmentsService {
    constructor(private readonly departmentsRepository: DepartmentsRepository) {}

    async findAll(): Promise<Department[]> {
        return this.departmentsRepository.findAll();
    }

    async findDepartmentById(id: string): Promise<Department> {
        return this.departmentsRepository.findDepartmentById(id);
    }

    async findDepartmentList(): Promise<Department[]> {
        return this.departmentsRepository.findDepartmentList();
    }

    async count(): Promise<number> {
        return this.departmentsRepository.count();
    }

    async create(department: CreateDepartmentDto): Promise<any> {
        return this.departmentsRepository.create(department);
    }
}
