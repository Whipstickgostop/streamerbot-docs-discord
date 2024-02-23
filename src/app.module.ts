import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DiscordModule } from './discord/discord.module';
import { FaqModule } from './faq/faq.module';

@Module({
  imports: [DiscordModule, FaqModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
