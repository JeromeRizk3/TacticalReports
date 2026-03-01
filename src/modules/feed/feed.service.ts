import { Injectable } from '@nestjs/common';
import { Record, RecordDocument } from './schemas/record.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
  ) {}
  async getFeed() {
    return this.recordModel.find();
  }
}
