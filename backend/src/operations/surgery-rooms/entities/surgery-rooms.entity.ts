import { Table, Column, Model, DataType, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { OperationRecords } from 'src/operations/operation_records/entities/operation_records.entity';

export enum OperatingRoomStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning'
}

export enum OperatingRoomSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

@Table({
  tableName: 'surgery_rooms',
  timestamps: true,
})
export class SurgeryRooms extends Model<SurgeryRooms> {
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
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(OperatingRoomStatus)),
    allowNull: false,
    defaultValue: OperatingRoomStatus.AVAILABLE,
  })
  status: OperatingRoomStatus;

  @Column({
    type: DataType.ENUM(...Object.values(OperatingRoomSize)),
    allowNull: false,
  })
  size: OperatingRoomSize;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  equipment: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 30,
    validate: {
      min: 10,
      max: 120,
    },
  })
  cleaning_time: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @HasMany(() => OperationRecords)
  operationRecords: OperationRecords[];
}