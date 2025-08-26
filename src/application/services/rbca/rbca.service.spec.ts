import { Test, TestingModule } from '@nestjs/testing';
import { RbcaService } from './rbca.service';

describe('RbcaService', () => {
  let service: RbcaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RbcaService],
    }).compile();

    service = module.get<RbcaService>(RbcaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
