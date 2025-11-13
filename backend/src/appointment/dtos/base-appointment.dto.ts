// src/appointment/dtos/base-appointment.dto.ts
import { IsUUID, IsDateString, IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';
import { AppointmentStatus } from '../enum/appointment-status.enum';
export class BaseAppointmentDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  doctorId: string;

  @IsDateString()
  appointmentDate: Date;

  @IsEnum(AppointmentStatus)
  status: string;

  @IsNumber()
  departmentId: number;

  @IsString()
  @IsOptional()
  notes?: string;
}