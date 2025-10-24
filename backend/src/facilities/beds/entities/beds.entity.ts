// entities/bed.entity.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { Department } from 'src/entity/departments/entities/departments.entity';
import { BedStatus } from 'src/facilities/beds/entities/beds_status.entity';
import { Patient } from 'src/entity/patients/entities/patients.entity';
import { Doctor } from 'src/entity/doctors/entities/doctors.entity';

@Table({ tableName: 'beds', timestamps: true })
export class Bed extends Model<Bed> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'bed_number' // 对应 bedNumber
  })
  bedNumber: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  floor: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'room'
  })
  room: string;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'department_id'
  })
  departmentId: number;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'attending_doctor_id'
  })
  attendingDoctorId: number;

  @ForeignKey(() => BedStatus)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'status_id'
  })
  statusId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  })
  isActive: boolean;

  // 关联关系
  @BelongsTo(() => Department)
  department: Department;

  @BelongsTo(() => Doctor)
  attendingDoctor: Doctor;

  @BelongsTo(() => BedStatus)
  status: BedStatus;

  @HasOne(() => Patient)
  patient: Patient;
}