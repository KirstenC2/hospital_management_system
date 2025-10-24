export class CreateDoctorDto {
    name: string;
    departmentId: number;
    title: string;
    phone: string;
    joinedDate?: Date;
    isActive: boolean;
}

