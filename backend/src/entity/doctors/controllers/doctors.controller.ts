import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { DoctorsService } from '../services/doctors.service';
import { Doctor } from '../entities/doctors.entity';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get('all')
  async findAll(): Promise<Doctor[]> {
    return this.doctorsService.findAll();
  }

  @Get('total')
  async count(): Promise<number> {
    return this.doctorsService.count();
  }

  @Post('new')
  async create(@Body() doctor: CreateDoctorDto): Promise<Doctor> {
    return this.doctorsService.create(doctor);
  }

  @Put('update/:id')
  async update(@Param('id') id: number, @Body() doctor: UpdateDoctorDto): Promise<Doctor> {
    return this.doctorsService.update(id, doctor);
  }
}
