import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CampaignInteraction {
  @Prop({ type: Types.ObjectId, required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  report_id: Types.ObjectId;

  @Prop({ required: true })
  campaign_type: string;

  @Prop({ required: true })
  action: string;

  @Prop({ type: Date, required: true })
  occured_at: Date;
}

export type CampaignInteractionDocument = CampaignInteraction & Document;
export const CampaignInteractionSchema = SchemaFactory.createForClass(
  CampaignInteraction,
);
