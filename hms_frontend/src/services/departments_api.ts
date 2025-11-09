import api from './api';

export interface DepartmentList {
    id: string;
    displayName: string;
}


class DepartmentsService {

    async getDepartmentList(): Promise<any[]> {
        return await api.get('/departments/list');
    }     

    async getDepartmentById(id: string): Promise<any> {
        return await api.get(`/departments/info?id=${id}`);
    }
}

export default new DepartmentsService();
