import { Test, TestingModule } from '@nestjs/testing';
import { ProgressNoteRepository } from './progress_note.repository';

describe('ProgressNoteRepository', () => {
  let repository: ProgressNoteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgressNoteRepository],
    }).compile();

    repository = module.get<ProgressNoteRepository>(ProgressNoteRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();  
  });
});
