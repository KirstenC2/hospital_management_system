import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Doctors } from '../entities/doctors.entity';
import { Department } from 'src/entity/departments/entities/departments.entity';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DoctorsRepository {
    constructor(
        @InjectModel(Doctors)
        private doctorsModel: typeof Doctors,
        private sequelize: Sequelize,
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

    async headcount(): Promise<any> {
        let sql = `SELECT COUNT(*), doctors."departmentId"  FROM doctors group by doctors."departmentId" ;`;
        return this.sequelize.query(sql, { type: QueryTypes.SELECT });
    }
    
    async update(id: number, doctor: any): Promise<any> {
        return this.doctorsModel.update(doctor, {
            where: { id }
        });
    }

    async getDoctorById(id: number): Promise<any> {
        return this.doctorsModel.findByPk(id);
    }
}
