import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { FaqCommandDto } from './dto/faq.dto';
import { FaqService } from './faq.service';
import { FaqAutocompleteInterceptor } from './interceptors/faq.interceptor';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { SearchService } from '../search/search.service';

@Injectable()
export class FaqCommands {
  private readonly logger = new Logger(FaqCommands.name);

  constructor(
    private readonly faqService: FaqService,
  ) {}

  @UseInterceptors(FaqAutocompleteInterceptor)
  @SlashCommand({
    name: 'faq',
    description: 'Frequently Asked Questions',
  })
  public async onFaq(@Context() [interaction]: SlashCommandContext, @Options() { search }: FaqCommandDto) {
    try {
      const faq = this.faqService.getFaqs().find((faq) => faq._path === search);
      if (!faq?.description || !faq?.content) return interaction.reply({ content: 'FAQ not found.' });

      // Add link to docs
      const docsButton = new ButtonBuilder()
        .setLabel('View on Docs')
        .setStyle(ButtonStyle.Link)
        .setURL(faq.url ?? `https://docs.streamer.bot/get-started/faq`)
        .setEmoji('📄');
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(docsButton);

      // Add YouTube link if available
      if (faq.youtubeId) {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`youtube/${faq.youtubeId}`)
            .setLabel('YouTube Tutorial')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('▶️'),
        );
      }

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
