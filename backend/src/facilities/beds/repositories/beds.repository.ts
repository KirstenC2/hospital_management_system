import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bed } from '../entities/beds.entity';
import { Sequelize } from 'sequelize';

@Injectable()
export class BedsRepository {
    constructor(
        @InjectModel(Bed)
        private bedsModel: typeof Bed,
    ) {}

    async findAll(options?: any): Promise<any> {
        return this.bedsModel.findAll(options);
    }

    async getBedById(id: number): Promise<any> {
        return this.bedsModel.findByPk(id);
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
