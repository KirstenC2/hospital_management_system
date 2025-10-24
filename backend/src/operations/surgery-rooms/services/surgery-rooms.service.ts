import { Injectable } from '@nestjs/common';
import { SurgeryRoomsRepository } from '../repositories/surgery-rooms.repository';
import { SurgeryRooms } from '../entities/surgery-rooms.entity';

@Injectable()
export class SurgeryRoomsService {
    constructor(private readonly surgeryRoomsRepository: SurgeryRoomsRepository) {}

    async findAll(): Promise<SurgeryRooms[]> {
        return this.surgeryRoomsRepository.findAll();
    }

    async getTotal(): Promise<number> {
        return this.surgeryRoomsRepository.getTotal();
    }

    async getStats(): Promise<any> {
        return this.surgeryRoomsRepository.getStats();
    }

    async createSurgeryRoom(surgeryRoom: SurgeryRooms): Promise<SurgeryRooms> {
        return this.surgeryRoomsRepository.createSurgeryRoom(surgeryRoom);
    }

    async updateStatus(roomId: string, status: string): Promise<string> {
        return this.surgeryRoomsRepository.updateStatus(roomId, status);
    }
}
