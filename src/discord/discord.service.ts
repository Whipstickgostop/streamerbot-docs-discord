import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Client } from 'discord.js';
import { Once, Context, ContextOf } from 'necord';

@Injectable()
export class DiscordService implements OnModuleDestroy {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;

  @Once('ready')
  public async onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`🚀 Bot logged in as ${client.user.username}`);
    this.client = client;

    if (process.env.NODE_ENV !== 'production') {
      await this.clearCommands();
    }
  }

  async onModuleDestroy(signal?: string) {
    this.logger.log(`Shutting down... (${signal})`);
    return await this.clearCommands();
  }

  public getClient() {
    return this.client;
  }

  private async clearCommands() {
    await this.getClient().application.commands.set([]);
    for (const guild of this.getClient().guilds.cache.values()) {
      await guild.commands.set([]);
    }
  }
}
