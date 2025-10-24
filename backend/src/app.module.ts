import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurgeryRoomsModule } from './operations/surgery-rooms/surgery-rooms.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SurgeryRooms } from './operations/surgery-rooms/entities/surgery-rooms.entity';
import { OperationRecords } from './operations/operation_records/entities/operation_records.entity';
import { OperationRecordsModule } from './operations/operation_records/operation_records.module';
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
        models: [SurgeryRooms, OperationRecords],
        autoLoadModels: true,
        synchronize: true,
        logging: console.log,
      }),
      inject: [ConfigService],
    }),
    SurgeryRoomsModule,
    OperationRecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}