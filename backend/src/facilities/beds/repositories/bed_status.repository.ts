import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BedStatus } from '../entities/beds_status.entity';
import { Sequelize } from 'sequelize';

@Injectable()
export class BedStatusRepository {
    constructor(
        @InjectModel(BedStatus)
        private bedStatusModel: typeof BedStatus,
    ) {}

    async findAll(): Promise<any> {
        return this.bedStatusModel.findAll();
    }

    async count(): Promise<number> {
        return this.bedStatusModel.count();
    }

    async stats(): Promise<any> {
        return this.bedStatusModel.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'total'],
                [Sequelize.fn('SUM', Sequelize.col('is_available')), 'available'],
                [Sequelize.fn('SUM', Sequelize.col('is_occupied')), 'occupied'],
            ],
        });
    }

    async create(beds: any): Promise<any> {
        return this.bedStatusModel.create(beds);
    }
}
