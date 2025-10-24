import { Injectable } from '@nestjs/common';
import { BedStatusRepository } from '../repositories/bed_status.repository';

@Injectable()
export class BedStatusService {

  constructor(
    private readonly bedStatusRepository: BedStatusRepository) {}
    
  async findAll(): Promise<any> {
    return this.bedStatusRepository.findAll();
  }

  async count(): Promise<number> {
    return this.bedStatusRepository.count();
  }

  async stats(): Promise<any> {
    return this.bedStatusRepository.stats();
  }

  async create(beds: any): Promise<any> {
    return this.bedStatusRepository.create(beds);
  }
}
