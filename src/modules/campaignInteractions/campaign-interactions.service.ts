import { Injectable } from '@nestjs/common';
import {
  CampaignInteraction,
  CampaignInteractionDocument,
} from './schemas/campaign-interaction.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CampaignInteractionsService {
  constructor(
    @InjectModel(CampaignInteraction.name)
    private readonly campaignInteractionModel: Model<CampaignInteractionDocument>,
  ) {}

  async create(
    user_id: string,
    report_id: string,
    campaign_type: string,
    action: string,
  ) {
    return this.campaignInteractionModel.create({
      user_id,
      report_id,
      campaign_type,
      action,
      occured_at: new Date(),
    });
  }

  async findByUserId(user_id: string) {
    return this.campaignInteractionModel.find({ user_id });
  }

  async findByReportId(report_id: string) {
    return this.campaignInteractionModel.find({ report_id });
  }

  async findByCampaignType(campaign_type: string) {
    return this.campaignInteractionModel.find({ campaign_type });
  }

  async findAll() {
    return this.campaignInteractionModel.find();
  }
}
