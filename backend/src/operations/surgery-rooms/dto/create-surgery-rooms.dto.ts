import { OperatingRoomStatus, OperatingRoomSize } from "../entities/surgery-rooms.entity";

export class CreateSurgeryRoomsDto {
    name: string;
    description: string;
    status: OperatingRoomStatus;
    size: OperatingRoomSize;
    equipment: string[];
    cleaning_time: number;
}