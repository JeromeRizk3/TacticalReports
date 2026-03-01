import { Test, TestingModule } from '@nestjs/testing';
import { CampaignInteractionsController } from './campaign-interactions.controller';
import { CampaignInteractionsService } from './campaign-interactions.service';

describe('CampaignInteractionsController', () => {
  let controller: CampaignInteractionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignInteractionsController],
      providers: [CampaignInteractionsService],
    }).compile();

    controller = module.get<CampaignInteractionsController>(
      CampaignInteractionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
