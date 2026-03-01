import { Module, Global, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: () => {
        Logger.log('Database Connected');
        return {
          closeConnection: async () => Logger.log('Database Connection Closed'),
        };
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}