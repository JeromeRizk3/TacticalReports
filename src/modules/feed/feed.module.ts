import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Record, RecordSchema } from './schemas/record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]),
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
