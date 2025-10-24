// src/services/surgeryRoomsService.ts
import api from './api';

export interface SurgeryRoom {
  id: string;
  name: string;
  description?: string;
  status: string;
  size: string;
  equipment: string[];
  cleaningTime: number;
  currentSurgery?: Surgery;
  nextSurgery?: Surgery;
  createdAt: string;
  updatedAt: string;
}
export interface Surgery {
  id: string
  patientId: string
  patientName: string
  roomId: string
  roomName: string
  type: string
  surgeonId: string
  surgeon: string
  date: string
  startTime: string
  endTime: string
  duration: number
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'normal' | 'high' | 'urgent'
  notes?: string
}

export interface OperatingRoom {
  id: string
  name: string
  status: 'available' | 'in_use' | 'maintenance' | 'cleaning'
  size: string
  equipment: string[]
  cleaningTime: number
  currentSurgery?: Surgery
  nextSurgery?: Surgery
}
export interface CreateSurgeryRoomDto {
  name: string;
  description?: string;
  status: string;
  size: string;
  equipment?: string[];
}

export interface UpdateSurgeryRoomDto {
  name?: string;
  description?: string;
  status?: string;
  size?: string;
  equipment?: string[];
}


class SurgeryRoomsService {
  // 获取所有手术室
  async getAllSurgeryRooms(): Promise<SurgeryRoom[]> {
    return await api.get('/surgery-rooms');
  }

  // 获取手术室统计信息
  async getStats(): Promise<any> {
    return await api.get('/surgery-rooms/stats');
  }

  // 获取单个手术室
  async getSurgeryRoom(id: string): Promise<SurgeryRoom> {
    return await api.get(`/surgery-rooms/${id}`);
  }

  // 创建手术室
  async createSurgeryRoom(data: CreateSurgeryRoomDto): Promise<SurgeryRoom> {
    return await api.post('/surgery-rooms/new', data);
  }

  async updateStatus(roomId: string, status: string): Promise<void> {
    return await api.put(`/surgery-rooms/update`, { roomId, status });
  }
}

export default new SurgeryRoomsService();