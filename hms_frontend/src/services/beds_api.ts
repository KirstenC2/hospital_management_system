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

export interface BedListParams {
    department_id?: number;
}

class BedsService {
    // 获取所有床位

    // async listAllBeds(departmentIds?: number[]): Promise<Beds[]> {
    //     return await api.get('/beds/list', { params: { departmentIds } });
    // }

    async listAllBeds(params?: BedListParams): Promise<Beds[]> {
        console.log(params);
        // 🚨 修正：直接返回 response，因為 api 實例可能已經解構了數據
        // 如果這個 api 實例已經配置了攔截器，它可能已經返回了 response.data
        const response = await api.get('/beds/list', { params }); 
        
        // 嘗試直接返回 response (如果 api 攔截器已解構)
        return response as unknown as Beds[]; 
    }

    async getAvailableBeds(): Promise<Beds[]> {
        return await api.get('/beds/available');
    }

    async findById(id: number): Promise<Beds> {
        return await api.get(`/beds/info?id=${id}`);
    }

    async activationStatusUpdate(id: number): Promise<void> {
        await api.put(`/beds/activation-status-update?id=${id}`);
    }

    // 创建床位
    async createBed(createBedDto: CreateBedDto): Promise<Beds> {
        return await api.post('/beds/new', createBedDto);
    }
}

export default new BedsService();
