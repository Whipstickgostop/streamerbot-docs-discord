import { Injectable, Logger, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { Client, EmbedBuilder } from 'discord.js';
import { Context, ContextOf, Once, SlashCommand, SlashCommandContext } from 'necord';

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
    await this.clearCommands();
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

  @SlashCommand({
    name: 'clear',
    description: `Remove all commands`,
    guilds: [process.env.DISCORD_GUILD_ID],
    defaultMemberPermissions: ['Administrator'],
  })
  public async onClear(@Context() [interaction]: SlashCommandContext) {
    if (process.env.NODE_ENV === 'production') {
      return interaction.reply({ content: 'This command is disabled in production', ephemeral: true });
    }

    try {
      await this.clearCommands();
      const embed = new EmbedBuilder()
      .setAuthor({
        name: `All commands removed`,
      })
      .setColor('#a257ed')
      .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (e) {
      this.logger.error('Error removing docs commands', e);
      return interaction.reply({
        content: 'An unknown error occurred while removing docs commands...',
        ephemeral: true,
      });
    }
  }
}
