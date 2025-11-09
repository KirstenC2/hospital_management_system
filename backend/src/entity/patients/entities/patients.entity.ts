// entities/patient.entity.ts
import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { InPatient } from '../inpatients/entities/inpatients.entity';

@Table({ 
  tableName: 'patients',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
})
export class Patient extends Model<Patient> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'name'
  })
  name: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    field: 'gender'
  })
  gender: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'age'
  })
  age: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'birth_date'
  })
  birthDate?: Date;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'phone'
  })
  phone?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'address'
  })
  address?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'emergency_contact'
  })
  emergencyContact?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'emergency_phone'
  })
  emergencyPhone?: string;

  // Relation to InPatient
  @HasOne(() => InPatient)
  inPatient?: InPatient;
}