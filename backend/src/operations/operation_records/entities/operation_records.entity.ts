// src/operations/entities/operation.entity.ts
import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey, 
  BelongsTo,
  CreatedAt,
  UpdatedAt, 
  AutoIncrement
} from 'sequelize-typescript';
import { SurgeryRooms } from '../../surgery-rooms/entities/surgery-rooms.entity';

export enum OperationStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum OperationType {
  CARDIAC = 'cardiac',
  NEURO = 'neurological',
  ORTHOPEDIC = 'orthopedic',
  GENERAL = 'general',
  PLASTIC = 'plastic',
  EMERGENCY = 'emergency'
}

@Table({
  tableName: 'operation_records',
  timestamps: true,
})
export class OperationRecords extends Model<OperationRecords> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => SurgeryRooms)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  surgeryRoomId: number;

  @BelongsTo(() => SurgeryRooms)
  surgeryRoom: SurgeryRooms;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  patientName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  patientAge: number;

  @Column({
    type: DataType.ENUM(...Object.values(OperationType)),
    allowNull: false,
  })
  operationType: OperationType;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  surgeonName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  anesthesiologistName: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  scheduledStartTime: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  scheduledEndTime: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  actualStartTime: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  actualEndTime: Date;

  @Column({
    type: DataType.ENUM(...Object.values(OperationStatus)),
    defaultValue: OperationStatus.SCHEDULED,
  })
  status: OperationStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isEmergency: boolean;

}