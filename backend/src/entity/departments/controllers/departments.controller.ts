import { Controller, Get, Post, Body } from '@nestjs/common';
import { DepartmentsService } from '../services/departments.service';
import { Department } from '../entities/departments.entity';
import { CreateDepartmentDto } from '../dto/create-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get('all')
  async findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Get('list')
  async findDepartmentList(): Promise<Department[]> {
    return this.departmentsService.findDepartmentList();
  }

  @Get('total')
  async count(): Promise<number> {
    return this.departmentsService.count();
  }

  @Post('new')
  async create(@Body() department: CreateDepartmentDto): Promise<Department> {
    return this.departmentsService.create(department);
  }   
}
