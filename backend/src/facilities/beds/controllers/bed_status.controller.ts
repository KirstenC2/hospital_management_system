import { Controller, Get, Post, Body } from '@nestjs/common';
import { BedStatusService } from '../services/bed_status.service';
import { CreateBedStatusDto } from '../dto/create-bed-status.dto';

@Controller('beds/status')
export class BedStatusController {
  constructor(private readonly bedStatusService: BedStatusService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.bedStatusService.findAll();
  } 

  @Get('total')
  async count(): Promise<number> {
    return this.bedStatusService.count();
  }

  @Get('stats')
  async stats(): Promise<any> {
    return this.bedStatusService.stats();
  }

  @Post('new')  
  async create(@Body() bedStatus: CreateBedStatusDto): Promise<any> {
    return this.bedStatusService.create(bedStatus);
  }
}
