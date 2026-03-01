import { Injectable } from '@nestjs/common';
import {
  ViewHistory,
  ViewHistoryDocument,
} from './schemas/view-history.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ViewHistoryService {
  constructor(
    @InjectModel(ViewHistory.name)
    private readonly viewHistoryModel: Model<ViewHistoryDocument>,
  ) {}

  async create(user_id: string, report_id: string, dwell_time_seconds: number) {
    return this.viewHistoryModel.create({
      user_id,
      report_id,
      viewed_at: new Date(),
      dwell_time_seconds,
    });
  }

  async findByUserId(user_id: string) {
    return this.viewHistoryModel.find({ user_id });
  }

  async findByReportId(report_id: string) {
    return this.viewHistoryModel.find({ report_id });
  }

  async findAll() {
    return this.viewHistoryModel.find();
  }
}
