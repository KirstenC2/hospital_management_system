import { Injectable } from '@nestjs/common';
import { DoctorsRepository } from '../repositories/doctors.repository';

@Injectable()
export class DoctorsService {
    constructor(private readonly doctorsRepository: DoctorsRepository) {}

    async findAll(): Promise<any> {
        return this.doctorsRepository.findAll();
    }

    async count(): Promise<number> {
        return this.doctorsRepository.count();
    }

    async headcount(): Promise<any> {
        return this.doctorsRepository.headcount();
    }

    async create(doctor: any): Promise<any> {
        return this.doctorsRepository.create(doctor);
    }

    async update(id: number, doctor: any): Promise<any> {
        return this.doctorsRepository.update(id, doctor);
    }
}
