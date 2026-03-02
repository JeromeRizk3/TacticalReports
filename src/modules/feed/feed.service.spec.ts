import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FeedService } from './feed.service';
import { ViewHistoryService } from '../viewHistory/view-history.service';
import { PurchasesService } from '../purchases/purchases.service';
import { CampaignInteractionsService } from '../campaignInteractions/campaign-interactions.service';
import { ConfigService } from '@nestjs/config';
import { Record } from './schemas/record.schema';

describe('FeedService', () => {
  let service: FeedService;
  const dummyRecords = [
    {
      _id: '1',
      title: 'A',
      category: 'cat1',
      toObject: () => ({ _id: '1', title: 'A', category: 'cat1' }),
    },
    {
      _id: '2',
      title: 'B',
      category: 'cat1',
      toObject: () => ({ _id: '2', title: 'B', category: 'cat1' }),
    },
    {
      _id: '3',
      title: 'C',
      category: 'cat2',
      toObject: () => ({ _id: '3', title: 'C', category: 'cat2' }),
    },
  ];

  beforeEach(async () => {
    const mockRecordModel = {
      find: jest.fn().mockResolvedValue(dummyRecords),
    };
    const mockViewHistory = { findByUserId: jest.fn().mockResolvedValue([]) };
    const mockPurchases = {
      findByUserId: jest.fn().mockResolvedValue([{ report_id: '1' }]),
    };
    const mockCampaign = { findByUserId: jest.fn().mockResolvedValue([]) };
    const mockConfig = {
      get: jest.fn().mockImplementation((key) => {
        if (key === 'PURCHASE_WEIGHT') return 10;
        if (key === 'VIEW_WEIGHT') return 1;
        if (key === 'CAMPAIGN_INTERACTION_WEIGHT') return 5;
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        { provide: getModelToken(Record.name), useValue: mockRecordModel },
        { provide: ViewHistoryService, useValue: mockViewHistory },
        { provide: PurchasesService, useValue: mockPurchases },
        { provide: CampaignInteractionsService, useValue: mockCampaign },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('adds category weight when a related record is purchased', async () => {
    const result = await service.getFeed('user1');
    // record 1 and 2 share category, purchase of 1 should boost both
    const item1 = result.items.find((i) => i._id === '1');
    const item2 = result.items.find((i) => i._id === '2');
    expect(item1.score).toBeGreaterThan(0);
    expect(item2.score).toBe(item1.score); // same category count = 1
    // record 3 belongs to other category and should have score 0
    const item3 = result.items.find((i) => i._id === '3');
    expect(item3.score).toBe(0);
  });
});
