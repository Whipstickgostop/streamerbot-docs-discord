import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DiscordModule } from './discord/discord.module';
import { FaqModule } from './faq/faq.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SearchModule } from './search/search.module';

@Module({
  imports: [ScheduleModule.forRoot(), DiscordModule, FaqModule, SearchModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
