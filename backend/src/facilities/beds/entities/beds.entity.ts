// entities/bed.entity.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { Department } from 'src/entity/departments/entities/departments.entity';
import { BedStatus } from 'src/facilities/beds/entities/beds_status.entity';
import { Patient } from 'src/entity/patients/entities/patients.entity';
import { Doctors } from 'src/entity/doctors/entities/doctors.entity';
import { InPatient } from 'src/entity/patients/inpatients/entities/inpatients.entity';

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
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'ward' // 对应 ward
  })
  ward: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'room_number' // 对应 roomNumber
  })
  roomNumber: string;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'department_id'
  })
  departmentId: number;

  @ForeignKey(() => Doctors)
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
    field: 'bed_status_id'
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

  @BelongsTo(() => Doctors)
  attendingDoctor: Doctors;

  @BelongsTo(() => BedStatus)
  status: BedStatus;

  @HasOne(() => InPatient)
  patient: InPatient;
}