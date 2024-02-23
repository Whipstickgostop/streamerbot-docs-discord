import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'discord.js';
import { Once, Context, ContextOf } from 'necord';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;

  @Once('ready')
  public onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`🚀 Bot logged in as ${client.user.username}`);
    this.client = client;
  }

  public getClient() {
    return this.client;
  }
}
