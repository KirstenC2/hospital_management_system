import api from './api';

export interface Doctor {
    id: string;
    name: string;
    departmentId: number;
    title: string;
    phone: string;
    department: {
        id: number;
        displayName: string;
    }
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

  // interface Doctor {
  //   id: string
  //   name: string
  //   specialty: string
  //   department: string
  //   patients: number
  //   experience: number
  // }

export interface CreateDoctorDto {
    name: string;
    departmentId: number;
    title: string;
    phone: string;
    isActive: boolean;
}

class DoctorsService {
    // 获取所有医生
    async getAllDoctors(): Promise<Doctor[]> {
        return await api.get('/doctors/all');
    }

    // 创建医生
    async createDoctor(data: CreateDoctorDto): Promise<Doctor> {
        return await api.post('/doctors/new', data);
    }

    async getDepartmentList(): Promise<any[]> {
        return await api.get('/departments/list');
    }     

    async updateDoctor(id: number, data: any): Promise<Doctor> {
        return await api.put(`/doctors/update/${id}`, data);
    }

    async getHeadcount(): Promise<any> {
        return await api.get('/doctors/department/headcount');
    }

}

export default new DoctorsService();
