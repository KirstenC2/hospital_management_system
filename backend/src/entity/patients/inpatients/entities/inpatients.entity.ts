import { 
  Table, 
  Model, 
  Column, 
  PrimaryKey, 
  AutoIncrement, 
  CreatedAt, 
  UpdatedAt, 
  BelongsTo,
  AllowNull,
  DataType,
  ForeignKey
} from 'sequelize-typescript';
import { Patient } from '../../entities/patients.entity';
import { Doctors } from 'src/entity/doctors/entities/doctors.entity';
import { Bed } from 'src/facilities/beds/entities/beds.entity';

@Table({ tableName: 'inpatient_records' })
export class InPatient extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  // Foreign Keys
  @ForeignKey(() => Patient)
  @Column({ field: 'patient_id' })
  patientId: number;


  @ForeignKey(() => Doctors)
  @Column({ field: 'doctor_id' })
  doctorId: number;

  @ForeignKey(() => Bed)
  @Column({ field: 'bed_id' })
  bedId?: number;

  // Basic Information
  @Column({ field: 'admission_date', type: 'date' })
  admissionDate: Date;

  @Column({ field: 'discharge_date', type: 'date', allowNull: true })
  dischargeDate?: Date;

  @Column({ field: 'expected_discharge_date', type: 'date', allowNull: true })
  expectedDischargeDate?: Date;

  @Column({ type: 'text', allowNull: true })
  diagnosis?: string;

  @Column({ field: 'chief_complaint', type: 'text', allowNull: true })
  chiefComplaint?: string;

  @Column({ 
    field: 'status', 
    type: DataType.STRING(20), 
    defaultValue: 'waiting' 
  })
  status: 'waiting' | 'inpatient' | 'discharged' | 'transferred';
  // Medical Information
  @Column({ field: 'medical_history', type: 'text', allowNull: true })
  medicalHistory?: string;

  @Column({ field: 'treatment_plan', type: 'text', allowNull: true })
  treatmentPlan?: string;

  @Column({ field: 'insurance_info', type: 'jsonb', allowNull: true })
  insuranceInfo?: any;

  @Column({ field: 'admission_notes', type: 'text', allowNull: true })
  admissionNotes?: string;

  @Column({ field: 'discharge_notes', type: 'text', allowNull: true })
  dischargeNotes?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;

  // Relations
  @BelongsTo(() => Patient, 'patientId')
  patient: Patient;

  @BelongsTo(() => Doctors, 'doctorId')
  doctor: Doctors;

  @BelongsTo(() => Bed, 'bedId')
  bed?: Bed;
}