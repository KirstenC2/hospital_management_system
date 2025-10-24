import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurgeryRoomsModule } from './operations/surgery-rooms/surgery-rooms.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SurgeryRooms } from './operations/surgery-rooms/entities/surgery-rooms.entity';
import { OperationRecords } from './operations/operation_records/entities/operation_records.entity';
import { OperationRecordsModule } from './operations/operation_records/operation_records.module';
import { BedsModule } from './facilities/beds/beds.module';
import { BedStatus } from './facilities/beds/entities/beds_status.entity';
import { Bed } from './facilities/beds/entities/beds.entity';
import { Patient } from './entity/patients/entities/patients.entity';
import { Doctor } from './entity/doctors/entities/doctors.entity';
import { Department } from './entity/departments/entities/departments.entity';
import { DepartmentsModule } from './entity/departments/departments.module';
import { PatientsModule } from './entity/patients/patients.module';
import { DoctorsModule } from './entity/doctors/doctors.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // 明确指定 env 文件路径
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'nestjs_db'),
        models: [
          SurgeryRooms, 
          OperationRecords,
          Bed,
          BedStatus,
          Patient,
          Doctor,
          Department,
        ],
        autoLoadModels: true,
        synchronize: true,
        logging: console.log,
      }),
      inject: [ConfigService],
    }),
    SurgeryRoomsModule,
    OperationRecordsModule,
    BedsModule,
    DepartmentsModule,
    PatientsModule,
    DoctorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}