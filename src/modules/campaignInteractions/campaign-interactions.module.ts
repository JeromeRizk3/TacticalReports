import { Module } from '@nestjs/common';
import { CampaignInteractionsController } from './campaign-interactions.controller';
import { CampaignInteractionsService } from './campaign-interactions.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CampaignInteraction,
  CampaignInteractionSchema,
} from './schemas/campaign-interaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampaignInteraction.name, schema: CampaignInteractionSchema },
    ]),
  ],
  controllers: [CampaignInteractionsController],
  providers: [CampaignInteractionsService],
  exports: [CampaignInteractionsService],
})
export class CampaignInteractionsModule {}
