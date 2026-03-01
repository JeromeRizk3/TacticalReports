import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { FeedModule } from './modules/feed/feed.module';
import { DatabaseModule } from './init/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthenticationModule,
    FeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
