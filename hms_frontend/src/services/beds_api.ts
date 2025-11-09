import api from './api';
export interface BedStatus {
    id: string;
    status: string;
    displayName: string;
}
export interface Beds {
    id: string;
   bedNumber: string;
   floor: number;
   ward: string;
   roomNumber: string;
   departmentId: string;
   statusId: string;
   status: BedStatus;
   isActive: boolean;
}
export interface CreateBedDto {
    bedNumber: string;
    floor: number;
    ward: string;
    roomNumber: string;
    departmentId: string;
    statusId: string;
    status: BedStatus;
    isActive: boolean;
}

class BedsService {
    // 获取所有床位
    async getAllBeds(): Promise<Beds[]> {
        return await api.get('/beds/all', {params:{status: 'available'}});
    }

    async getAvailableBeds(): Promise<Beds[]> {
        return await api.get('/beds/available');
    }

    // 创建床位
    async createBed(createBedDto: CreateBedDto): Promise<Beds> {
        return await api.post('/beds/new', createBedDto);
    }
}

export default new BedsService();
