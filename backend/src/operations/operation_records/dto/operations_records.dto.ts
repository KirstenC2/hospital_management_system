import { OperationType, OperationStatus } from "../entities/operation_records.entity";

export class CreateOperationRecordsDto {
    surgeryRoomId: number;
    patientName: string;
    patientAge: number;
    operationType: OperationType;
    description: string;
    surgeonName: string;
    anesthesiologistName: string;
    scheduledStartTime: Date;
    scheduledEndTime: Date;
    actualStartTime: Date;
    actualEndTime: Date;
    status: OperationStatus;
    notes: string;
    isEmergency: boolean;
}   