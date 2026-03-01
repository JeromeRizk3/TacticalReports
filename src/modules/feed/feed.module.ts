import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Record, RecordSchema } from './schemas/record.schema';
import { PurchasesModule } from '../purchases/purchases.module';
import { ViewHistoryModule } from '../viewHistory/view-history.module';
import { CampaignInteractionsModule } from '../campaignInteractions/campaign-interactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]),
    PurchasesModule,
    ViewHistoryModule,
    CampaignInteractionsModule,
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
