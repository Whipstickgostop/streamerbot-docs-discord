import { Injectable, Logger } from '@nestjs/common';
import { AutocompleteInteraction } from 'discord.js';
import { AutocompleteInterceptor } from 'necord';
import { SearchService } from '../search.service';

@Injectable()
export class TriggerAutocompleteInterceptor extends AutocompleteInterceptor {
  private readonly logger = new Logger(TriggerAutocompleteInterceptor.name);

  constructor(private readonly searchService: SearchService) {
    super();
  }

  public async transformOptions(interaction: AutocompleteInteraction) {
    try {
      const focused = interaction.options.getFocused(true);
      if (focused.name !== 'search') return;

      return interaction.respond(
        this.searchService
          .getTriggers()
          .filter((trigger) => {
            const terms = focused.value.toString().split(' ');
            return terms.every((term) => {
              return (
                !!trigger?.title?.match(new RegExp(term, 'i')) ||
                !!trigger?.description?.match(new RegExp(term, 'i'))
              );
            });
          })
          .slice(0, 25)
          .map((trigger) => ({
            name: `${trigger.hierarchy.join(' › ')} › ${trigger.title}`.slice(0, 100),
            value: trigger._path,
            description: trigger._path,
          })),
      );
    } catch (e) {
      this.logger.error('Failed to transform trigger autocomplete options', e);
    }
  }
}
