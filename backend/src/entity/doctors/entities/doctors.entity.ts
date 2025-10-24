// entities/doctor.entity.ts
import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Department } from '../../departments/entities/departments.entity';
import { Bed } from 'src/facilities/beds/entities/beds.entity';

@Table({ 
  tableName: 'doctors', timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
 })
export class Doctor extends Model<Doctor> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  departmentId: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  title: string; // '主任醫師', '主治醫師', '住院醫師'

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  joinedDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @BelongsTo(() => Department)
  department: Department;

  @HasMany(() => Bed)
  beds: Bed[];
}