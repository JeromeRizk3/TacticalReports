import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ViewHistory {
  @Prop({ type: Types.ObjectId, required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  report_id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  viewed_at: Date;

  @Prop({ type: Number, required: true })
  dwell_time_seconds: number;
}

export type ViewHistoryDocument = ViewHistory & Document;
export const ViewHistorySchema = SchemaFactory.createForClass(ViewHistory);
