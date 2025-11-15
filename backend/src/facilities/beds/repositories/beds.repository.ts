import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bed } from '../entities/beds.entity';
import { Sequelize } from 'sequelize';
import { BedStatus } from '../entities/beds_status.entity';
import { Patient } from 'src/entity/patients/entities/patients.entity';
import { InPatient } from 'src/entity/patients/inpatients/entities/inpatients.entity';
import { Department } from 'src/entity/departments/entities/departments.entity';
@Injectable()
export class BedsRepository {
    constructor(
        @InjectModel(Bed)
        private bedsModel: typeof Bed,
        @InjectModel(BedStatus)
        private bedStatusModel: typeof BedStatus,   
        @InjectModel(InPatient)
        private inPatientModel: typeof InPatient,
        @InjectModel(Patient)
        private patientModel: typeof Patient,
        @InjectModel(Department)
        private departmentModel: typeof Department,
    ) {}

    async findAll(options?: any): Promise<any> {
        return this.bedsModel.findAll({
            include: [{
                model: this.bedStatusModel,
                as: 'status',
                required: true
            }],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            ...options
        });
    }

    async findAllAvailableBeds(): Promise<any> {
        return this.bedsModel.findAll({
            include: [{
                model: this.bedStatusModel,
                as: 'status',
                where: {
                    status: 'available'
                },
                required: true
            }],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    }

    async deactivateBed(id: number): Promise<void> {
        await this.bedsModel.update({ isActive: false }, { where: { id } });
    }

    async getBedById(id: number): Promise<any> {
        return this.bedsModel.findByPk(id, {
            include: [{
                model: this.bedStatusModel,
                as: 'status',
                required: true
            },{
                model: this.inPatientModel,
                as: 'patient',
                required: false,
                include: [{
                    model: this.patientModel,
                    as: 'patient',
                    required: true
                }]

            },
            {
                model: this.departmentModel,
                as: 'department',
                required: false
            }
        ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'patientId']
            }
        });
    }

    async count(options?: any): Promise<number> {
    const result = await this.bedsModel.count(options);
    // If result is a number, return it directly
    if (typeof result === 'number') {
        return result;
    }
    // If result is GroupedCountResultItem[], extract the count from the first item
    if (Array.isArray(result) && result.length > 0 && typeof result[0].count === 'number') {
        return result[0].count;
    }
    // Fallback: return 0 if no results
    return 0;
}

    async stats(): Promise<any> {
        return this.bedsModel.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'total'],
                [Sequelize.fn('SUM', Sequelize.col('is_active')), 'true'],
                [Sequelize.fn('SUM', Sequelize.col('is_active')), 'false'],
            ],
        });
    }

    async create(bed: any): Promise<any> {
        return this.bedsModel.create(bed);
    }
}
