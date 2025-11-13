// src/appointment/dtos/create-appointment.dto.ts
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { AppointmentStatus } from '../enum/appointment-status.enum';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  appointmentDate: Date;

  @IsEnum(AppointmentStatus)
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  departmentId: number;

  @IsString()
  @IsOptional()
  notes?: string;
}