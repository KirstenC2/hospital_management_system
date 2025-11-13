import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Patient } from 'src/entity/patients/entities/patients.entity';
import { Doctors } from 'src/entity/doctors/entities/doctors.entity';
import { AppointmentStatus } from 'src/appointment/enum/appointment-status.enum';
import { Department } from 'src/entity/departments/entities/departments.entity';

export enum AppointmentType {
  FIRST_VISIT = 'first_visit',
  FOLLOW_UP = 'follow_up',
  CONSULTATION = 'consultation',
  EMERGENCY = 'emergency'
}

@Table({
  tableName: 'appointments',
  timestamps: true,
  indexes: [
    {
      fields: ['appointmentDate', 'doctorId']
    },
    {
      fields: ['patientId', 'appointmentDate']
    },
    {
      fields: ['status']
    }
  ]
})
export class Appointment extends Model<Appointment> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Patient)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  patientId: number;

  @BelongsTo(() => Patient)
  patient: Patient;

  @ForeignKey(() => Doctors)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  doctorId: number;

  @BelongsTo(() => Doctors)
  doctor: Doctors;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  appointmentDate: Date;


  @Column({
    type: DataType.ENUM(...Object.values(AppointmentStatus)),
    defaultValue: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;


  @ForeignKey(() => Department)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  department_id: number;


  @BelongsTo(() => Department)
  department: Department;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  confirmedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  cancelledAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completedAt: Date;


}