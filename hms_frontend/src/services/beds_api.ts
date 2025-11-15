import api from './api';
import type { BasePatient } from './patients_api';
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
   patient: BasePatient;
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

    async listAllBeds(): Promise<Beds[]> {
        return await api.get('/beds/list');
    }

    async getAvailableBeds(): Promise<Beds[]> {
        return await api.get('/beds/available');
    }

    async findById(id: number): Promise<Beds> {
        return await api.get(`/beds/info?id=${id}`);
    }

    // 创建床位
    async createBed(createBedDto: CreateBedDto): Promise<Beds> {
        return await api.post('/beds/new', createBedDto);
    }
}

export default new BedsService();
