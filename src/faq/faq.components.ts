import { Injectable } from '@nestjs/common';
import { ActionRowBuilder } from 'discord.js';
import { Button, ButtonContext, Context, SelectedStrings, StringSelect, StringSelectContext } from 'necord';
import { FaqService } from './faq.service';

@Injectable()
export class FaqComponents {
  constructor(private readonly faqService: FaqService) {}

  @Button('FAQ_MENU_BUTTON')
  public async onFaqMenuButton(@Context() [interaction]: ButtonContext) {
    const row = new ActionRowBuilder().addComponents(this.faqService.generateMenuComponent());
    // @ts-expect-error - Discord.js types incorrect?
    return interaction.reply({ content: 'Select an FAQ', components: [row], ephemeral: true });
  }

  @StringSelect('FAQ_SELECT_MENU')
  public onStringSelect(@Context() [interaction]: StringSelectContext, @SelectedStrings() selected: string[]) {
    const faq = this.faqService.getFaqs().find((faq) => faq._path === selected[0]);
    if (!faq?.description || !faq?.content) return interaction.reply({ content: 'FAQ not found.' });
    return interaction.reply({
      embeds: [this.faqService.generateEmbed(faq)],
      ephemeral: true,
    });
  }
}
