// src/appointment/dtos/appointment-response.dto.ts
import { Exclude, Expose, Type } from 'class-transformer';
import { AppointmentStatus } from '../enum/appointment-status.enum';

@Exclude()
export class AppointmentResponseDto {
  @Expose()
  id: string;

  @Expose()
  patientId: string;

  @Expose()
  doctorId: string;

  @Expose()
  @Type(() => Date)
  appointmentDate: Date;

  @Expose()
  status: AppointmentStatus;

  @Expose()
  departmentId: number;

  @Expose()
  notes?: string;

  @Expose()
  @Type(() => Date)
  confirmedAt?: Date;

  @Expose()
  @Type(() => Date)
  cancelledAt?: Date;

  @Expose()
  @Type(() => Date)
  completedAt?: Date;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}