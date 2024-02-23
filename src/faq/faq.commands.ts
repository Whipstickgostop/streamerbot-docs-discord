import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { FaqCommandDto } from './dto/faq.dto';
import { FaqService } from './faq.service';
import { FaqAutocompleteInterceptor } from './interceptors/faq.interceptor';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

@Injectable()
export class FaqCommands {
  private readonly logger = new Logger(FaqCommands.name);

  constructor(private readonly faqService: FaqService) {}

  @SlashCommand({
    name: 'refresh',
    description: `Refresh documentation contents`,
    guilds: [process.env.DISCORD_GUILD_ID],
  })
  public async onReload(@Context() [interaction]: SlashCommandContext) {
    try {
      await this.faqService.fetchFaqs();
      return interaction.reply({ content: 'Docs reloaded', ephemeral: true });
    } catch (e) {
      this.logger.error('Error reloading docs', e);
      return interaction.reply({
        content: 'An unknown error occurred',
        ephemeral: true,
      });
    }
  }

  @UseInterceptors(FaqAutocompleteInterceptor)
  @SlashCommand({
    name: 'faq',
    description: 'Frequently Asked Questions',
    guilds: [process.env.DISCORD_GUILD_ID],
  })
  public async onFaq(@Context() [interaction]: SlashCommandContext, @Options() { search }: FaqCommandDto) {
    try {
      const faq = this.faqService.getFaqs().find((faq) => faq._path === search);
      if (!faq?.description || !faq?.content) return interaction.reply({ content: 'FAQ not found.' });
      const docsButton = new ButtonBuilder()
        .setLabel('View on Docs')
        .setStyle(ButtonStyle.Link)
        .setURL('https://docs.streamer.bot/get-started/faq');
      const row = new ActionRowBuilder().addComponents(docsButton);
      // @ts-expect-error - Discord.js types incorrect?
      return interaction.reply({ embeds: [this.faqService.generateEmbed(faq)], components: [row] });
    } catch (e) {
      this.logger.error('Error respondng to /faq request', e);
      console.log(e);
      return interaction.reply({
        content: 'An unknown error occurred',
        ephemeral: true,
      });
    }
  }
}
