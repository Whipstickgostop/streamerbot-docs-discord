import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Client } from 'discord.js';
import { Context, ContextOf, Once } from 'necord';

@Injectable()
export class DiscordService implements OnModuleDestroy {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;

  @Once('ready')
  public async onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`🚀 Bot logged in as ${client.user.username}`);
    this.client = client;
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

    // Development guild
    if (process.env.DISCORD_GUILD_ID) {
      const guild = await this.getClient().guilds.fetch(process.env.DISCORD_GUILD_ID);
      await guild.commands.set([]);
    }

    // Cached guilds
    for (const guild of this.getClient().guilds.cache.values()) {
      await guild.commands.set([]);
    }
  }
}
