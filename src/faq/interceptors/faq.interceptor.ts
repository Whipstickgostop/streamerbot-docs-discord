import { Injectable, Logger } from '@nestjs/common';
import { AutocompleteInteraction } from 'discord.js';
import { AutocompleteInterceptor } from 'necord';
import { FaqService } from '../faq.service';

@Injectable()
export class FaqAutocompleteInterceptor extends AutocompleteInterceptor {
  private readonly logger = new Logger(FaqAutocompleteInterceptor.name);

  constructor(private readonly faqService: FaqService) {
    super();
  }

  public async transformOptions(interaction: AutocompleteInteraction) {
    try {
      const focused = interaction.options.getFocused(true);
      if (focused.name !== 'search') return;

      return interaction.respond(
        this.faqService
          .getFaqs()
          .filter((faq) => faq.description.match(new RegExp(focused.value.toString(), 'i')))
          .slice(0, 25)
          .map((faq) => ({ name: faq.description.slice(0, 100), value: faq._path })),
      );
    } catch (e) {
      this.logger.error('Failed to transform faq options', e);
    }
  }
}
