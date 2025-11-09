import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProgressNote } from '../entities/progress_note.entity';
import { CreateProgressNoteDto } from '../dtos/progress_note.dto';

@Injectable()
export class ProgressNoteRepository {
  constructor(
    @InjectModel(ProgressNote)
    private readonly progressNoteModel: typeof ProgressNote,
  ) {}

  async create(createDto: CreateProgressNoteDto): Promise<ProgressNote> {
  return this.progressNoteModel.create({
    title: createDto.title,
    description: createDto.description,
    doctor_id: createDto.doctorId, // Note: using doctor_id to match database column
    record_date: new Date(),
  } as any);
}

  async findAll(): Promise<ProgressNote[]> {
    return this.progressNoteModel.findAll();
  }

  async findAllByRecordId(recordId: string): Promise<ProgressNote[]> {
    return this.progressNoteModel.findAll({
      where: { record_id: recordId },
      order: [['record_date', 'DESC']], // 按日期降序排列
    });
  }
}
