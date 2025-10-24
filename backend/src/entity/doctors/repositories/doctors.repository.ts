import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Doctor } from '../entities/doctors.entity';
import { Department } from 'src/entity/departments/entities/departments.entity';

@Injectable()
export class DoctorsRepository {
    constructor(
        @InjectModel(Doctor)
        private doctorsModel: typeof Doctor,
    ) {}

    async findAll(): Promise<any> {
        return this.doctorsModel.findAll({
            include:[Department]
        });
    }

    async count(): Promise<number> {
        return this.doctorsModel.count();
    }

    async create(doctor: any): Promise<any> {
        return this.doctorsModel.create(doctor);
    }
    
    async update(id: number, doctor: any): Promise<any> {
        return this.doctorsModel.update(doctor, {
            where: { id }
        });
    }
}
