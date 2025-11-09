// entities/surgery-reservation.entity.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SurgeryRooms } from 'src/operations/surgery-rooms/entities/surgery-rooms.entity';
import { Doctors } from 'src/entity/doctors/entities/doctors.entity';
import { Patient } from 'src/entity/patients/entities/patients.entity';
import { SurgeryTypes } from 'src/operations/surgery_types/entities/surgery_types.entity';
import { BeforeCreate } from 'sequelize-typescript';

@Table({ tableName: 'surgery_reservations', timestamps: true })
export class SurgeryReservation extends Model<SurgeryReservation> {
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

  reservationNumber: string; // 预约编号

  @ForeignKey(() => Patient)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  patientId: number;

  @ForeignKey(() => Doctors)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  surgeonId: number; // 主刀医生

  @ForeignKey(() => Doctors)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  assistantSurgeonId: number; // 助理医生

  @ForeignKey(() => Doctors)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  anesthesiologistId: number; // 麻醉医生

  @ForeignKey(() => SurgeryRooms)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  operatingRoomId: number;

  @ForeignKey(() => SurgeryTypes)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  surgeryTypeId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  scheduledDate: Date; // 预约日期

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  startTime: string; // 开始时间

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  endTime: string; // 结束时间

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  estimatedDuration: number; // 预计时长（分钟）

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'scheduled',
  })
  status: string; // 状态：scheduled, in_progress, completed, cancelled

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string; // 备注

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  diagnosis: string; // 诊断

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  procedureDescription: string; // 手术过程描述

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  equipmentRequirements: any; // 特殊设备需求

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  nursingTeam: any; // 护理团队

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isEmergency: boolean; // 是否急诊手术

   @BeforeCreate
  static async generateReservationNumber(instance: SurgeryReservation) {
    if (!instance.reservationNumber) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const timestamp = Date.now().toString().slice(-6);
      
      instance.reservationNumber = `SR-${year}${month}${day}-${timestamp}`;
    }
  } 

  // 关联关系
  @BelongsTo(() => Patient)
  patient: Patient;

  @BelongsTo(() => Doctors, 'surgeonId')
  surgeon: Doctors;

  @BelongsTo(() => Doctors, 'assistantSurgeonId')
  assistantSurgeon: Doctors;

  @BelongsTo(() => Doctors, 'anesthesiologistId')
  anesthesiologist: Doctors;

  @BelongsTo(() => SurgeryRooms)
  surgeryRoom: SurgeryRooms;

  @BelongsTo(() => SurgeryTypes)
  surgeryType: SurgeryTypes;
}