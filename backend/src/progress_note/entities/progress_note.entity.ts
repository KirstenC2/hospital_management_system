// src/progress-notes/progress-note.model.ts

import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { MedicalRecord } from 'src/medical_records/entities/medical_records.entity'; // 假設病歷模型路徑
import { Doctors } from 'src/entity/doctors/entities/doctors.entity';

@Table({
  tableName: 'progress_note', // 資料庫中實際的表名
  timestamps: true, // 啟用 createdAt 和 updatedAt
  underscored: true, // 啟用 snake_case 命名 (e.g., record_id)
})
export class ProgressNote extends Model<ProgressNote> {

  // progress_id (主鍵，自動增長)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  progress_id: string;

  // record_id (外鍵：連接到 MedicalRecord)
  @ForeignKey(() => MedicalRecord)
  @Column({
    type: DataType.INTEGER, // 假設 MedicalRecord 的主鍵是 UUID
    allowNull: false,
  })
  record_id: number;
  
  // 建立關聯：每個進度記錄屬於一個病歷
  @BelongsTo(() => MedicalRecord)
  record: MedicalRecord;


  // title (標題/處置名稱)
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  // description (詳細描述)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  // doctor_id (外鍵：記錄醫生 ID)
  @ForeignKey(() => Doctors)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  doctor_id: number;

  // 建立關聯：記錄醫生
  @BelongsTo(() => Doctors)
  doctor: Doctors;
  
  // record_date (記錄日期和時間 - 這裡使用 Sequelize 的 createdAt)
  // 如果需要一個單獨的記錄日期欄位，可以額外添加
  @Column({
      type: DataType.DATE,
      defaultValue: DataType.NOW,
  })
  record_date: Date;

}