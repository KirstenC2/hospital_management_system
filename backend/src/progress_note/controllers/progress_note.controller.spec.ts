import { Test, TestingModule } from '@nestjs/testing';
import { ProgressNoteController } from './progress_note.controller';
import { ProgressNotesService } from '../services/progress_note.service';

describe('ProgressNoteController', () => {
  let controller: ProgressNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressNoteController],
      providers: [ProgressNotesService],
    }).compile();

    controller = module.get<ProgressNoteController>(ProgressNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
