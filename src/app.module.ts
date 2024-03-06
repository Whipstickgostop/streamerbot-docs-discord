import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DiscordModule } from './discord/discord.module';
import { FaqModule } from './faq/faq.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), DiscordModule, FaqModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
