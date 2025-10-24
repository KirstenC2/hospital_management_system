import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SurgeryRoomsService } from './services/surgery-rooms.service';
import { SurgeryRoomsController } from './controllers/surgery-rooms.controller';
import { SurgeryRoomsRepository } from './repositories/surgery-rooms.repository';
import { SurgeryRooms } from './entities/surgery-rooms.entity';

@Module({
  imports: [SequelizeModule.forFeature([SurgeryRooms])],
  controllers: [SurgeryRoomsController],
  providers: [SurgeryRoomsService, SurgeryRoomsRepository],
  exports: [SurgeryRoomsService],
})
export class SurgeryRoomsModule {}
