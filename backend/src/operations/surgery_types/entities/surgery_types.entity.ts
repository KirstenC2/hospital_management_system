// entities/surgery-type.entity.ts
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { SurgeryReservation } from 'src/operations/surgery_reservation/entities/surgery_reservation.entity';
@Table({ tableName: 'surgery_types', timestamps: true })
export class SurgeryTypes extends Model<SurgeryTypes> {
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
  name: string; // 手术类型名称

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  displayName: string; // 显示名称

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string; // 描述

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 60,
  })
  defaultDuration: number; // 默认时长（分钟）

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean; // 是否启用

  @HasMany(() => SurgeryReservation)
  reservations: SurgeryReservation[];
}