import { Controller, Get, Post, Body, Put, Query } from '@nestjs/common';
import { SurgeryRoomsService } from '../services/surgery-rooms.service';
import { OperatingRoomStatus, SurgeryRooms } from '../entities/surgery-rooms.entity';

@Controller('surgery-rooms')
export class SurgeryRoomsController {
  constructor(private readonly surgeryRoomsService: SurgeryRoomsService) {}

  @Get('total')
  async getTotal() {
    return this.surgeryRoomsService.getTotal();
  }

  @Get('stats')
  async getStats() {
    return this.surgeryRoomsService.getStats();
  }

  @Get()
  async findAll() {
    return this.surgeryRoomsService.findAll();
  }


  @Post('new')
  async createSurgeryRoom(@Body() surgeryRoom: SurgeryRooms) {
    return this.surgeryRoomsService.createSurgeryRoom(surgeryRoom);
  }

  @Put('update')
  async updateStatus(@Body() body: { roomId: string, status: string }):Promise<string> {
    return this.surgeryRoomsService.updateStatus(body.roomId, body.status);
  }

}
