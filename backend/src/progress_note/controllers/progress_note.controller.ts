import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProgressNotesService } from '../services/progress_note.service';
import { CreateProgressNoteDto } from '../dtos/progress_note.dto';
import { ProgressNote } from '../entities/progress_note.entity';

@Controller('progress-note')
export class ProgressNoteController {
  constructor(private readonly progressNoteService: ProgressNotesService) {}

  @Post()
  create(@Body() createDto: CreateProgressNoteDto): Promise<ProgressNote> {
    return this.progressNoteService.createProgressNote(createDto.record_id, createDto as any);
  }

  @Get()
  findAll(): Promise<ProgressNote[]> {
    return this.progressNoteService.findAll();
  } 

  @Get('record/:recordId')
  findAllByRecordId(@Param('recordId') recordId: string): Promise<ProgressNote[]> {
    return this.progressNoteService.findAllByRecordId(recordId);
  }
}
