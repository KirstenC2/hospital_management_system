import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SurgeryRooms } from '../entities/surgery-rooms.entity';
import { Sequelize } from 'sequelize-typescript';
import { OperatingRoomStatus } from '../entities/surgery-rooms.entity';

@Injectable()
export class SurgeryRoomsRepository {
    constructor(
        @InjectModel(SurgeryRooms)
        private surgeryRoomsModel: typeof SurgeryRooms,
    ) { }

    async findAll(): Promise<SurgeryRooms[]> {
        return this.surgeryRoomsModel.findAll();
    }

    async getTotal(): Promise<number> {
        return this.surgeryRoomsModel.count();
    }

    async getStats(): Promise<any> {
        const totalRooms = await this.surgeryRoomsModel.count();

        const availableRooms = await this.surgeryRoomsModel.count({
            where: { status: OperatingRoomStatus.AVAILABLE }
        });

        const inUseRooms = await this.surgeryRoomsModel.count({
            where: { status: OperatingRoomStatus.IN_USE }
        });

        const cleaningRooms = await this.surgeryRoomsModel.count({
            where: { status: OperatingRoomStatus.CLEANING }
        });

        const maintenanceRooms = await this.surgeryRoomsModel.count({
            where: { status: OperatingRoomStatus.MAINTENANCE }
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return {
            totalRooms,
            availableRooms,
            inUseRooms,
            cleaningRooms,
            maintenanceRooms,
        };
    }

    async createSurgeryRoom(surgeryRoom: SurgeryRooms): Promise<SurgeryRooms> {
        return this.surgeryRoomsModel.create(surgeryRoom);
    }

    async updateStatus(roomId: string, status: string): Promise<string> {
        const statusEnum = OperatingRoomStatus[status.toUpperCase()];
        if(statusEnum === undefined) {
            throw new Error('Invalid status');
        }

        let result = await this.surgeryRoomsModel.update({ status: statusEnum }, { where: { id: roomId } });
        if(result[0] === 0) {
            throw new Error('Room not found');
        }
        return "Room status updated successfully";
    }
}
