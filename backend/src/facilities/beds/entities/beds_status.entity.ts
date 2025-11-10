// entities/bed-status.entity.ts
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Bed } from './beds.entity';

@Table({ tableName: 'bed_status', timestamps: true })
export class BedStatus extends Model<BedStatus> {
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
  })
  status: string; // 'available', 'occupied', 'maintenance', 'reserved', 'cleaning'

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  displayName: string; // '可用', '佔用中', '維護中', '已預約', '清潔中'

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    field: 'color_code'
  })
  colorCode: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_available'
  })
  isAvailable: boolean;

  @HasMany(() => Bed)
  beds: Bed[];
}