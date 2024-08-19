import { Injectable, Logger } from '@nestjs/common';
import { AutocompleteInteraction } from 'discord.js';
import { AutocompleteInterceptor } from 'necord';
import { SearchService } from '../search.service';

@Injectable()
export class SubActionAutocompleteInterceptor extends AutocompleteInterceptor {
  private readonly logger = new Logger(SubActionAutocompleteInterceptor.name);

  constructor(private readonly searchService: SearchService) {
    super();
  }

  public async transformOptions(interaction: AutocompleteInteraction) {
    try {
      const focused = interaction.options.getFocused(true);
      if (focused.name !== 'search') return;

      return interaction.respond(
        this.searchService
          .getSubActions()
          .filter((subAction) => {
            const terms = focused.value.toString().split(' ');
            return terms.every((term) => {
              return (
                !!subAction?.title?.match(new RegExp(term, 'i')) ||
                !!subAction?.description?.match(new RegExp(term, 'i'))
              );
            });
          })
          .slice(0, 25)
          .map((subAction) => ({
            name: `${subAction.hierarchy.join(' › ')} › ${subAction.title}`.slice(0, 100),
            value: subAction._path,
          })),
      );
    } catch (e) {
      this.logger.error('Failed to transform sub-action autocomplete options', e);
    }
  }
}
