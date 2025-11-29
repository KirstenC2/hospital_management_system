import { Injectable } from '@nestjs/common';
import { Bed } from '../entities/beds.entity';
import { BedsRepository } from '../repositories/beds.repository';

@Injectable()
export class BedsService {

    constructor(private readonly bedsRepository: BedsRepository) {}
  async findAll(options?: any): Promise<any> {
    if (options) {
      return this.bedsRepository.findAll(options);
    } else {
      return this.bedsRepository.findAll();
    }
  }

  async findAllAvailableBeds(): Promise<any> {
    return this.bedsRepository.findAllAvailableBeds();
  }

  async updateBedStatus(id: number, statusId: number): Promise<void> {
    return this.bedsRepository.updateBedStatus(id, statusId);
  }

  async getBedById(id: number): Promise<any> {
    return this.bedsRepository.getBedById(id);
  }

  async deactivateBed(id: number): Promise<void> {
    return this.bedsRepository.deactivateBed(id);
  }

  async count(): Promise<number> {
    return this.bedsRepository.count();
  }

  async stats(): Promise<any> {
    return this.bedsRepository.stats();
  }

  async activationStatusUpdate(id: number): Promise<void> {
    const bed = await this.bedsRepository.getBedActiveStatus(id);
    if (bed.is_active) {
        const result = await this.bedsRepository.activationStatusUpdate(id, false);
        return result;
    } else {
        const result = await this.bedsRepository.activationStatusUpdate(id, true);
        return result;
    }
  }

  async create(bed: any): Promise<any> {
    let result = await this.bedsRepository.create(bed);
    if (result) {
        return result;
    }
    return null;
  }

}   
