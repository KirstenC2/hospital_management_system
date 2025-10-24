// src/services/operationsService.ts
import api from './api';

export enum OperationStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum OperationType {
  CARDIAC = 'cardiac',
  NEURO = 'neurological',
  ORTHOPEDIC = 'orthopedic',
  GENERAL = 'general',
  PLASTIC = 'plastic',
  EMERGENCY = 'emergency'
}

export interface Operation {
  id: string;
  surgeryRoomId: string;
  patientName: string;
  patientAge: number;
  operationType: OperationType;
  description?: string;
  surgeonName: string;
  anesthesiologistName: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: OperationStatus;
  notes?: string;
  isEmergency: boolean;
  createdAt: string;
  updatedAt: string;
  surgeryRoom?: {
    id: string;
    name: string;
    roomNumber: string;
  };
}

export interface CreateOperationDto {
  surgeryRoomId: string;
  patientName: string;
  patientAge: number;
  operationType: OperationType;
  description?: string;
  surgeonName: string;
  anesthesiologistName: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  isEmergency?: boolean;
  notes?: string;
}

export interface UpdateOperationDto {
  surgeryRoomId?: string;
  patientName?: string;
  patientAge?: number;
  operationType?: OperationType;
  description?: string;
  surgeonName?: string;
  anesthesiologistName?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  status?: OperationStatus;
  actualStartTime?: string;
  actualEndTime?: string;
  notes?: string;
  isEmergency?: boolean;
}

class OperationsService {
  // 获取所有手术记录
  async getAllOperations(): Promise<Operation[]> {
    return await api.get('/operations');
  }

  // 获取单个手术记录
  async getOperation(id: string): Promise<Operation> {
    return await api.get(`/operations/${id}`);
  }

  // 创建手术记录
  async createOperation(data: CreateOperationDto): Promise<Operation> {
    return await api.post('/operations', data);
  }

}

export default new OperationsService();