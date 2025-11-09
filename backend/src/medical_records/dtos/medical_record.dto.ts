// backend/src/entity/medical-records/dto/medical-record.dto.ts
import { IsString, IsNumber, IsDateString, IsIn, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateMedicalRecordDto {
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @IsNumber()
  @IsNotEmpty()
  doctorId: number;

  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsIn(['normal', 'high'])
  priority: 'normal' | 'high';

  @IsString()
  @IsIn(['active', 'completed', 'archived'])
  @IsOptional()
  status?: 'active' | 'completed' | 'archived';

  @IsDateString()
  @IsNotEmpty()
  admissionDate: Date;
}

export class UpdateMedicalRecordDto {
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsIn(['normal', 'high'])
  @IsOptional()
  priority?: 'normal' | 'high';

  @IsString()
  @IsIn(['active', 'completed', 'archived'])
  @IsOptional()
  status?: 'active' | 'completed' | 'archived';
}