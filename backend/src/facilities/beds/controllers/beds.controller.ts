import { Controller, Get, Post, Body, Query, Put } from '@nestjs/common';
import { BedsService } from '../services/beds.service';
import { Bed } from '../entities/beds.entity';

@Controller('beds')
export class BedsController {
  constructor(private readonly bedsService: BedsService) {}

  @Get('all')
  async findAll(): Promise<Bed[]> {
    return this.bedsService.findAll();
  } 

  @Get('available')
  async available(): Promise<any> {
    return this.bedsService.findAllAvailableBeds();
  }

  @Get('total')
  async count(): Promise<number> {
    return this.bedsService.count();
  }

  @Post('new')
  async create(@Body() bed: Bed): Promise<Bed> {
    return this.bedsService.create(bed);
  }

  @Get('list')
  async listAll(): Promise<Bed[]> {
    return this.bedsService.findAll();
  }

  @Get('info')
  async findById(@Query('id') id: string): Promise<Bed> {
    return this.bedsService.getBedById(+id);
  }

  @Put('deactivate')
  async deactivate(@Query('id') id: string): Promise<void> {
    return this.bedsService.deactivateBed(+id);
  }
}
