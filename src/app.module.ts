import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { FeedModule } from './modules/feed/feed.module';
import { DatabaseModule } from './init/database/database.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { ViewHistoryModule } from './modules/viewHistory/view-history.module';
import { CampaignInteractionsModule } from './modules/campaignInteractions/campaign-interactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthenticationModule,
    FeedModule,
    PurchasesModule,
    ViewHistoryModule,
    CampaignInteractionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
