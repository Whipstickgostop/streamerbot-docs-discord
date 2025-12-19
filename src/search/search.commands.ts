import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { FaqService } from '../faq/faq.service';
import { CSharpCommandDto } from './dto/csharp.dto';
import { SubActionDto } from './dto/sub-action.dto';
import { TriggerDto } from './dto/trigger.dto';
import { CSharpMethodAutocompleteInterceptor } from './interceptors/csharp.interceptor';
import { SubActionAutocompleteInterceptor } from './interceptors/sub-action.interceptor';
import { TriggerAutocompleteInterceptor } from './interceptors/trigger.interceptor';
import { SearchService } from './search.service';

@Injectable()
export class SearchCommands {
  private readonly logger = new Logger(SearchCommands.name);

  constructor(
    private readonly searchService: SearchService,
    private readonly faqService: FaqService
  ) {}

  @SlashCommand({
    name: 'refresh',
    description: `Refresh documentation contents`,
    guilds: [process.env.DISCORD_GUILD_ID],
    defaultMemberPermissions: ['Administrator'],
  })
  public async onReload(@Context() [interaction]: SlashCommandContext) {
    try {
      const docs = await this.searchService.fetchDocs();
      const methods = await this.searchService.fetchCSharpMethods();
      const faqs = await this.faqService.fetchFaqs();

      const embed = new EmbedBuilder()
      .addFields([
        { name: 'Documents', value: `${docs.length}`, inline: true },
        { name: 'C# Methods', value: `${methods.length}`, inline: true },
        { name: 'FAQs', value: `${faqs.length}`, inline: true },
      ])
      .setAuthor({
        name: `Docs Reloaded`,
      })
      .setColor('#a257ed')
      .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (e) {
      this.logger.error('Error reloading docs', e);
      return interaction.reply({
        content: 'An unknown error occurred while refreshing docs...',
      });
    }
  }

  @UseInterceptors(CSharpMethodAutocompleteInterceptor)
  @SlashCommand({
    name: 'csharp',
    description: 'C# Methods',
  })
  public async onCSharpMethodSearch(
    @Context() [interaction]: SlashCommandContext,
    @Options() { search }: CSharpCommandDto,
  ) {
    const methods = this.searchService.getCsharpMethods().filter((method) => method.name === search);
    const method = methods[0];
    if (!method) return interaction.reply({ content: 'Method not found', ephemeral: true });

    const url = `https://docs.streamer.bot${method.path}`;

    const embed = new EmbedBuilder()
      .setDescription(`\`\`\`cs\n${method.signature}\n\`\`\``)
      .setURL(url)
      .setAuthor({
        name: `C# Methods › ${method.hierarchy.join(' › ')}`,
        iconURL: 'https://streamer.bot/logo-100x100.png',
        url,
      })
      .setColor('#a257ed');

    // Add link to docs
    const docsButton = new ButtonBuilder()
      .setLabel('View on Docs')
      .setStyle(ButtonStyle.Link)
      .setURL(url)
      .setEmoji('📄');
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(docsButton);

    return interaction.reply({
      embeds: [embed],
      components: [row],
    });
  }

  @UseInterceptors(SubActionAutocompleteInterceptor)
  @SlashCommand({
    name: 'sub-action',
    description: 'Sub-Actions Search',
  })
  public async onSubActionSearch(
    @Context() [interaction]: SlashCommandContext,
    @Options() { search }: SubActionDto,
  ) {
    const subActions = this.searchService.getSubActions();
    const subAction = subActions.find((subAction) => subAction.path === search);
    if (!subAction) return interaction.reply({ content: 'Sub-Action not found', ephemeral: true });

    const url = `https://docs.streamer.bot${subAction.path}`;

    const embed = new EmbedBuilder()
      .setDescription(subAction.description)
      .setURL(url)
      .setAuthor({
        name: `Sub-Actions › ${subAction.hierarchy.join(' › ')} › ${subAction.title}`,
        iconURL: 'https://streamer.bot/logo-100x100.png',
        url,
      })
      .setColor('#a257ed');

    // Add link to docs
    const docsButton = new ButtonBuilder()
      .setLabel('View on Docs')
      .setStyle(ButtonStyle.Link)
      .setURL(url)
      .setEmoji('📄');
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(docsButton);

    return interaction.reply({
      embeds: [embed],
      components: [row],
    });
  }

  @UseInterceptors(TriggerAutocompleteInterceptor)
  @SlashCommand({
    name: 'trigger',
    description: 'Triggers Search',
  })
  public async onTriggerSearch(
    @Context() [interaction]: SlashCommandContext,
    @Options() { search }: TriggerDto,
  ) {
    const triggers = this.searchService.getTriggers();
    const trigger = triggers.find((trigger) => trigger.path === search);
    if (!trigger) return interaction.reply({ content: 'Trigger not found', ephemeral: true });

    const url = `https://docs.streamer.bot${trigger.path}`;

    const embed = new EmbedBuilder()
      .setDescription(trigger.description)
      .setURL(url)
      .setAuthor({
        name: `Triggers › ${trigger.hierarchy.join(' › ')} › ${trigger.title}`,
        iconURL: 'https://streamer.bot/logo-100x100.png',
        url,
      })
      .setColor('#a257ed');

    // Add link to docs
    const docsButton = new ButtonBuilder()
      .setLabel('View on Docs')
      .setStyle(ButtonStyle.Link)
      .setURL(url)
      .setEmoji('📄');
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(docsButton);

    return interaction.reply({
      embeds: [embed],
      components: [row],
    });
  }
}
