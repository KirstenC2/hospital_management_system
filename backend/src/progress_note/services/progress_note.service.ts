// src/progress-notes/progress-notes.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProgressNote } from '../entities/progress_note.entity';
import { ProgressNoteRepository } from '../repositories/progress_note.repository';
import { MedicalRecordsService } from 'src/medical_records/services/medical_records.service';

// 定義新增進度記錄所需資料的 DTO (Data Transfer Object) 介面
interface CreateProgressNoteDto {
  title: string;
  description: string;
  doctor_id: string;
}

@Injectable()
export class ProgressNotesService {
  constructor(
    private readonly progressNoteRepository: ProgressNoteRepository,
    private readonly medicalRecordService: MedicalRecordsService
  ) {}

  /**
   * 新增一筆治療進度記錄
   * @param recordId 目標病歷 ID
   * @param dto 進度記錄數據
   * @returns 新增的進度記錄
   */
  async createProgressNote(recordId: string, dto: CreateProgressNoteDto): Promise<ProgressNote> {
    
    // 1. 檢查目標病歷是否存在
    const record = await this.medicalRecordService.getMedicalRecordById(recordId);
    if (!record) {
      throw new NotFoundException(`病歷 ID: ${recordId} 不存在`);
    }

    // 2. 創建新的進度記錄
    const newNote = await this.progressNoteRepository.create({
      ...dto,
      record_id: recordId,
      record_date: new Date()
    } as any);

    // 3. 更新病歷的最後更新時間 (lastUpdate)
    await record.update({ updated_at: new Date() }); 

    return newNote;
  }
  
  /**
   * 取得特定病歷的所有進度記錄
   * @param recordId 目標病歷 ID
   * @returns 進度記錄列表
   */
  async findAllByRecordId(recordId: string): Promise<ProgressNote[]> {
      return this.progressNoteRepository.findAllByRecordId(recordId);
  }

  async findAll(): Promise<ProgressNote[]> {
    return this.progressNoteRepository.findAll();
  }
}