import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import { FaqItem } from './dto/faq.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class FaqService implements OnModuleInit {
  private readonly logger = new Logger(FaqService.name);
  private faqs: FaqItem[] = [];

  public async onModuleInit() {
    this.fetchFaqs();
  }

  public getFaqs() {
    return this.faqs;
  }

  /**
   * Fetch the latest FAQ data from the Streamer.bot docs
   */
  @Cron('0 * * * *')
  public async fetchFaqs() {
    try {
      const res = await fetch('https://docs.streamer.bot/api/faqs.json', { cache: 'no-cache' });
      const data = await res.json();
      this.faqs = data?.length ? data : [];
    } catch (e) {
      this.logger.error('Failed to fetch faqs', e);
    }
  }

  /**
   * Generate a Discord embed for a given FaqItem
   */
  public generateEmbed(faq: FaqItem) {
    const embed = new EmbedBuilder()
      .setTitle(faq?.description)
      .setDescription(faq.content)
      .setURL(`https://docs.streamer.bot/get-started/faq`)
      .setAuthor({
        name: 'Frequently Asked Questions',
        iconURL: 'https://streamer.bot/logo-100x100.png',
        url: 'https://docs.streamer.bot/get-started/faq',
      })
      .setColor('#a257ed');

    // Automatically extract and embed the first image in the document
    if (faq.images?.at(0)) {
      embed.setImage(faq.images[0]);
    }

    return embed;
  }

  /**
   * Generate a select menu component for all FAQ documents
   */
  public generateMenuComponent() {
    const options = this.getFaqs().map((faq) => ({
      label: faq.description.slice(0, 100),
      value: faq._path,
    }));
    return new StringSelectMenuBuilder()
      .setCustomId('FAQ_SELECT_MENU')
      .setPlaceholder('Select an FAQ')
      .setMaxValues(1)
      .setMinValues(1)
      .setOptions(options);
  }
}
