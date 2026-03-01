import { Injectable } from '@nestjs/common';
import { Purchase, PurchaseDocument } from './schemas/purchase.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name)
    private readonly purchaseModel: Model<PurchaseDocument>,
  ) {}

  async create(user_id: string, report_id: string) {
    return this.purchaseModel.create({
      user_id,
      report_id,
      purchased_at: new Date(),
    });
  }

  async findByUserId(user_id: string) {
    return this.purchaseModel.find({ user_id });
  }

  async findByReportId(report_id: string) {
    return this.purchaseModel.find({ report_id });
  }

  async findAll() {
    return this.purchaseModel.find();
  }
}
