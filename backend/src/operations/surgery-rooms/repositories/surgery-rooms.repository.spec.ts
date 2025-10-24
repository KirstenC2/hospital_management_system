import { Test, TestingModule } from '@nestjs/testing';
import { SurgeryRoomsRepository } from './surgery-rooms.repository';

describe('SurgeryRoomsRepository', () => {
  let repo: SurgeryRoomsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurgeryRoomsRepository],
    }).compile();

    repo = module.get<SurgeryRoomsRepository>(SurgeryRoomsRepository);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });
});
