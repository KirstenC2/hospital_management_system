import api from './api';

export interface DepartmentList {
    id: string;
    displayName: string;
}


class DepartmentsService {

    async getDepartmentList(): Promise<any[]> {
        return await api.get('/departments/list');
    }     

}

export default new DepartmentsService();
