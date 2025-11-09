// backend/src/entity/medical-records/entities/medical-record.entity.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Patient } from 'src/entity/patients/entities/patients.entity';
import { Doctors } from 'src/entity/doctors/entities/doctors.entity';


@Table({ tableName: 'medical_records' })
export class MedicalRecord extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Patient)
  @Column({ field: 'patient_id' })
  patientId: number;

  @ForeignKey(() => Doctors)
  @Column({ field: 'doctor_id' })
  doctorId: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  diagnosis: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  symptoms?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  allergies?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  priority: 'normal' | 'high';

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'active',
  })
  status: 'active' | 'completed' | 'archived';

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'admission_date',
  })
  admissionDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_updated',
  })
  lastUpdated: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'update_by',
  })
  updateBy?: string;

  // Relations
  @BelongsTo(() => Patient)
  patient: Patient;

  @BelongsTo(() => Doctors)
  doctor: Doctors;
}