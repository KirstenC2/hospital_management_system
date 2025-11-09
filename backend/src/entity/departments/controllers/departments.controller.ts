import { Controller, Get, Post, Body, Query } from '@nestjs/common';
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

  @Get('info')
  async findDepartmentById(@Query('id') id: string): Promise<Department> {
    return this.departmentsService.findDepartmentById(id);
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
