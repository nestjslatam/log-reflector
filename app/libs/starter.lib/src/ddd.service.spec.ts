import { Test, TestingModule } from '@nestjs/testing';
import { DddService } from './ddd.service';

describe('DddService', () => {
  let service: DddService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DddService],
    }).compile();

    service = module.get<DddService>(DddService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
