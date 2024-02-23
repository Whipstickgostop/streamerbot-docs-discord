import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AutocompleteInteraction } from 'discord.js';
import { AutocompleteInterceptor } from 'necord';

@Injectable()
export class FaqAutocompleteInterceptor extends AutocompleteInterceptor implements OnModuleInit {
  private readonly logger = new Logger(FaqAutocompleteInterceptor.name);
  private faqs = [];

  public async onModuleInit() {
    try {
      const res = await fetch('https://docs.streamer.bot/api/faqs.json');
      const data = await res.json();
      this.faqs = data?.length ? data : [];
    } catch (e) {
      this.logger.error('Failed to fetch faqs', e);
    }
  }

  public async transformOptions(interaction: AutocompleteInteraction) {
    try {
      const focused = interaction.options.getFocused(true);
      if (focused.name !== 'search') return;

      return interaction.respond(
        this.faqs
          .filter((faq) => faq.description.match(new RegExp(focused.value.toString(), 'i')))
          .map((faq) => ({ name: faq.description.slice(0, 100), value: faq._path })),
      );
    } catch (e) {
      this.logger.error('Failed to transform faq options', e);
    }
  }
}
