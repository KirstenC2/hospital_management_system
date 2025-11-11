import { IsString, IsNumber, IsOptional, IsDateString, IsIn, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePatientDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @IsNumber()
  age: number;

  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  emergencyContact?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  emergencyPhone?: string;
}

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @IsNumber()
  id: number;
}

export class GetPatientListDto {
  id: number;
  name: string;
  gender: string;
  age: number;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}