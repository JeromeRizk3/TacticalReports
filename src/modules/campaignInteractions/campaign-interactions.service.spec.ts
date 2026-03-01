import { Test, TestingModule } from '@nestjs/testing';
import { CampaignInteractionsService } from './campaign-interactions.service';

describe('CampaignInteractionsService', () => {
  let service: CampaignInteractionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignInteractionsService],
    }).compile();

    service = module.get<CampaignInteractionsService>(
      CampaignInteractionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
