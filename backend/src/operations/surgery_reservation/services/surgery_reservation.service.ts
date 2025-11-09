import { Injectable } from '@nestjs/common';
import { SurgeryReservationRepository } from '../repositories/surgery_reservation.repository';
import { CreateSurgeryReservationDto } from '../dto/surgery_reservation.dto';

@Injectable()
export class SurgeryReservationService {
    constructor(private readonly surgeryReservationRepository: SurgeryReservationRepository) {}

    async createSurgeryReservation(reservationData: Partial<CreateSurgeryReservationDto>) {
    try {
      // 确保数据类型正确
      const processedData = {
        ...reservationData,
        patientId: parseInt(reservationData.patientId as any),
        surgeryTypeId: parseInt(reservationData.surgeryTypeId as any),
        operatingRoomId: parseInt(reservationData.operatingRoomId as any),
        surgeonId: parseInt(reservationData.surgeonId as any),
        assistantSurgeonId: reservationData.assistantSurgeonId ? 
          parseInt(reservationData.assistantSurgeonId as any) : null,
        anesthesiologistId: reservationData.anesthesiologistId ? 
          parseInt(reservationData.anesthesiologistId as any) : null,
        estimatedDuration: parseInt(reservationData.estimatedDuration as any),
        // 处理日期格式
        scheduledDate: new Date(reservationData.scheduledDate as any),
      };

      // 移除空字符串，转换为 null
      Object.keys(processedData).forEach(key => {
        if (processedData[key] === '') {
          processedData[key] = null;
        }
      });

      return await this.surgeryReservationRepository.createSurgeryReservation(processedData as any);
    } catch (error) {
      console.error('创建手术预约失败:', error);
      throw new Error('创建手术预约失败');
    }
  }
}
