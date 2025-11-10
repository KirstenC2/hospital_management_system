import { Injectable } from '@nestjs/common';
import { Bed } from '../entities/beds.entity';
import { BedsRepository } from '../repositories/beds.repository';

@Injectable()
export class BedsService {

    constructor(private readonly bedsRepository: BedsRepository) {}
  async findAll(): Promise<any> {
    return this.bedsRepository.findAll();
  }

  async findAllAvailableBeds(): Promise<any> {
    return this.bedsRepository.findAllAvailableBeds();
  }

  async getBedById(id: number): Promise<any> {
    return this.bedsRepository.getBedById(id);
  }

  async count(): Promise<number> {
    return this.bedsRepository.count();
  }

  async stats(): Promise<any> {
    return this.bedsRepository.stats();
  }

  async create(bed: any): Promise<any> {
    return this.bedsRepository.create(bed);
  }

}   
