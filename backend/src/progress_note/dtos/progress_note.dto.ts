// src/progress-notes/dto/create-progress-note.dto.ts

import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateProgressNoteDto {    
    @IsNotEmpty({ message: '病歷 ID 不能為空' })
    @IsString()
    record_id: string;
    
    @IsNotEmpty({ message: '進度記錄標題不能為空' })
    @IsString()
    title: string;
    
    @IsNotEmpty({ message: '詳細描述不能為空' })
    @IsString()
    description: string;

    @IsNotEmpty({ message: '記錄醫生 ID 不能為空' })
    @IsString()
    doctorId: string;
    
    @IsNotEmpty({ message: '記錄日期 不能為空' })
    @IsDate()
    record_date: Date;
}