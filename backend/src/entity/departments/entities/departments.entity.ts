// entities/department.entity.ts
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Bed } from 'src/facilities/beds/entities/beds.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Table({ tableName: 'departments', timestamps: true })
export class Department extends Model<Department> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  name: string; // 'pediatrics', 'obstetrics', 'cardiology', 'neurology'

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  displayName: string; // '兒科', '婦產科', '心臟科', '神經科'

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @HasMany(() => Bed)
  beds: Bed[];

  @HasMany(() => Appointment)
  appointments: Appointment[];
}