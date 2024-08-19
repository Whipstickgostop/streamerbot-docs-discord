import { Injectable, Logger } from '@nestjs/common';
import { AutocompleteInteraction } from 'discord.js';
import { AutocompleteInterceptor } from 'necord';
import { SearchService } from '../search.service';

@Injectable()
export class CSharpMethodAutocompleteInterceptor extends AutocompleteInterceptor {
  private readonly logger = new Logger(CSharpMethodAutocompleteInterceptor.name);

  constructor(private readonly searchService: SearchService) {
    super();
  }

  public async transformOptions(interaction: AutocompleteInteraction) {
    try {
      const focused = interaction.options.getFocused(true);
      if (focused.name !== 'search') return;

      return interaction.respond(
        this.searchService
          .getCsharpMethods()
          .filter((method) => {
            const terms = focused.value.toString().split(' ');
            return terms.every((term) => {
              return (
                !!method.signature.match(new RegExp(term, 'i')) ||
                !!method.hierarchy.join(' ').match(new RegExp(term, 'i')) ||
                !!method.name.match(new RegExp(term, 'i'))
              );
            });
          })
          .slice(0, 25)
          .map((method) => ({
            name: `${method.hierarchy.join(' › ')} › ${method.name}`.slice(0, 100),
            description: method.signature,
            value: method.name,
          })),
      );
    } catch (e) {
      this.logger.error('Failed to transform C# method autocomplete options', e);
    }
  }
}
