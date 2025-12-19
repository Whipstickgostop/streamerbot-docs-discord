import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { DiscordModule } from './discord/discord.module';
import { FaqModule } from './faq/faq.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    DiscordModule,
    FaqModule,
    SearchModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
