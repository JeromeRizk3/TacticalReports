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
    const purchasedCategories = [
      ...new Set(purchasedReports.map((r) => r.category)),
    ];

    const recordsWithScore = records.map((record) => {
      let score = 0;
      const reasons: string[] = [];

      const purchaseCount = purchases.filter(
        (p) => p.report_id.toString() === record._id.toString(),
      ).length;
      if (purchaseCount > 0) {
        score +=
          purchaseCount * (this.config.get<number>('PURCHASE_WEIGHT') ?? 10);
      }

      const viewHistoryEntries = viewHistory.filter(
        (v) => v.report_id.toString() === record._id.toString(),
      );
      if (viewHistoryEntries.length > 0) {
        score +=
          viewHistoryEntries.length *
          (this.config.get<number>('VIEW_WEIGHT') ?? 1);
        reasons.push('recently viewed similar content');
      }

      const campaignCount = campaignInteractions.filter(
        (c) => c.report_id.toString() === record._id.toString(),
      ).length;
      if (campaignCount > 0) {
        score +=
          campaignCount *
          (this.config.get<number>('CAMPAIGN_INTERACTION_WEIGHT') ?? 5);
      }

      if (purchasedCategories.includes(record.category)) {
        reasons.unshift(`because you purchased ${record.category} reports`);
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
