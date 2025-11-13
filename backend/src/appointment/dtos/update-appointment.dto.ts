// src/appointment/dtos/update-appointment.dto.ts
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  confirmedAt?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  cancelledAt?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  completedAt?: Date;
}