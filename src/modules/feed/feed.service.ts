import { Injectable } from '@nestjs/common';
import { Record, RecordDocument } from './schemas/record.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ViewHistoryService } from '../viewHistory/view-history.service';
import { PurchasesService } from '../purchases/purchases.service';
import { ConfigService } from '@nestjs/config';
import { CampaignInteractionsService } from '../campaignInteractions/campaign-interactions.service';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
    private readonly viewHistoryService: ViewHistoryService,
    private readonly purchasesService: PurchasesService,
    private readonly campaignInteractionsService: CampaignInteractionsService,
    private readonly config: ConfigService,
  ) {}

  async getFeed(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
  ) {
    let query: any = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    const records = await this.recordModel.find(query);

    const [viewHistory, purchases, campaignInteractions] = await Promise.all([
      this.viewHistoryService.findByUserId(userId),
      this.purchasesService.findByUserId(userId),
      this.campaignInteractionsService.findByUserId(userId),
    ]);

    const purchasedReports = await this.recordModel.find({
      _id: { $in: purchases.map((p) => p.report_id) },
    });

    const categoryScores: any = {};

    purchasedReports.forEach((r) => {
      const cat = r.category;
      if (!categoryScores[cat]) {
        categoryScores[cat] = { purchaseCount: 0, campaignCount: 0 };
      }
      categoryScores[cat].purchaseCount += 1;
    });

    const recordMap = new Map<string, RecordDocument>(
      records.map((r) => [r._id.toString(), r]),
    );
    campaignInteractions.forEach((c) => {
      const rec = recordMap.get(c.report_id.toString());
      if (rec) {
        const cat = rec.category;
        if (!categoryScores[cat]) {
          categoryScores[cat] = { purchaseCount: 0, campaignCount: 0 };
        }
        categoryScores[cat].campaignCount += 1;
      }
    });

    const recordsWithScore = records.map((record) => {
      let score = 0;
      const reasons: string[] = [];

      const purchaseWeight = this.config.get<number>('PURCHASE_WEIGHT') ?? 10;
      const campaignWeight =
        this.config.get<number>('CAMPAIGN_INTERACTION_WEIGHT') ?? 5;
      const viewWeight = this.config.get<number>('VIEW_WEIGHT') ?? 1;

      const catData = categoryScores[record.category] || {
        purchaseCount: 0,
        campaignCount: 0,
      };
      if (catData.purchaseCount > 0) {
        score += catData.purchaseCount * purchaseWeight;
        reasons.push(`because you purchased ${record.category} reports`);
      }
      if (catData.campaignCount > 0) {
        score += catData.campaignCount * campaignWeight;
        reasons.push(
          `because you interacted with ${record.category} campaigns`,
        );
      }

      const viewHistoryEntries = viewHistory.filter(
        (v) => v.report_id.toString() === record._id.toString(),
      );
      if (viewHistoryEntries.length > 0) {
        score += viewHistoryEntries.length * viewWeight;
        reasons.push('recently viewed similar content');
      }

      const { tags, ...recordWithoutTags } = record.toObject();

      const finalReason =
        reasons.length > 0 ? reasons.join(' and ') : 'recommended for you';
      const capitalizedReason =
        finalReason.charAt(0).toUpperCase() + finalReason.slice(1);

      return {
        ...recordWithoutTags,
        score,
        reason: capitalizedReason,
      };
    });

    const sortedRecords = recordsWithScore.sort((a, b) => b.score - a.score);
    const total = sortedRecords.length;
    const skip = (page - 1) * limit;
    const paginatedItems = sortedRecords.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      user_id: userId,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
      items: paginatedItems,
    };
  }
}
