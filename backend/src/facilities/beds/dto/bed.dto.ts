export class CreateBedDto {
    bed_number: string;
    room_number: string;
    ward: string;
    bed_status_id: number;
    is_active: boolean;
    location_info: any;
    notes: string;
}