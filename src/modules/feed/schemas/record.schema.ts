import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Record {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Date, default: null })
  published_at: Date | null;
}

export type RecordDocument = Record & Document;
export const RecordSchema = SchemaFactory.createForClass(Record);