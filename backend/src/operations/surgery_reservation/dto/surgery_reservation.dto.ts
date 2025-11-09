export class CreateSurgeryReservationDto {
    patientId: string;
    surgeryTypeId: string;
    operatingRoomId: string;
    surgeonId: string;
    assistantSurgeonId: string;
    anesthesiologistId: string;
    scheduledDate: string;
    estimatedDuration: number;
    startTime: string;
    endTime: string;
    diagnosis: string;
    procedureDescription: string;
    notes: string;
}
