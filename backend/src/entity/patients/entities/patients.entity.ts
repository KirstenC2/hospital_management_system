// entities/patient.entity.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Bed } from 'src/facilities/beds/entities/beds.entity';

@Table({ tableName: 'patients', timestamps: true })
export class Patient extends Model<Patient> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  gender: string; // '男', '女'

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  age: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'admission_date'
  })
  admissionDate: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  diagnosis: string; // 診斷

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'care_level'
  })
  careLevel: string; // '一級護理', '特級護理'

  @ForeignKey(() => Bed)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    field: 'bed_id'
  })
  bedId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  })
  isActive: boolean;

  @BelongsTo(() => Bed)
  bed: Bed;
}