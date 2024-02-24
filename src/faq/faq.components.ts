import { Injectable } from '@nestjs/common';
import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import {
  Button,
  ButtonContext,
  ComponentParam,
  Context,
  SelectedStrings,
  StringSelect,
  StringSelectContext,
} from 'necord';
import { FaqService } from './faq.service';

@Injectable()
export class FaqComponents {
  constructor(private readonly faqService: FaqService) {}

  @Button('youtube/:id')
  public async onYoutubeButton(@Context() [interaction]: ButtonContext, @ComponentParam('id') id: string) {
    return interaction.reply({ content: `https://www.youtube.com/watch?v=${id}`, ephemeral: true });
  }

  @Button('FAQ_MENU_BUTTON')
  public async onFaqMenuButton(@Context() [interaction]: ButtonContext) {
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(this.faqService.generateMenuComponent());
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
