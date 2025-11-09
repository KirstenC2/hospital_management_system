import { Module } from '@nestjs/common';
import { ProgressNotesService } from './services/progress_note.service';
import { ProgressNoteController } from './controllers/progress_note.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProgressNote } from './entities/progress_note.entity';
import { ProgressNoteRepository } from './repositories/progress_note.repository';
import { MedicalRecordsModule } from 'src/medical_records/medical_records.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProgressNote]),
    MedicalRecordsModule],
  controllers: [ProgressNoteController],
  providers: [ProgressNotesService, ProgressNoteRepository],
  exports: [ProgressNotesService],
})
export class ProgressNoteModule { }
