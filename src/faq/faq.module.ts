import { Module } from '@nestjs/common';
import { FaqCommands } from './faq.commands';
import { FaqAutocompleteInterceptor } from './interceptors/faq.interceptor';
import { FaqService } from './faq.service';
import { FaqComponents } from './faq.components';

@Module({
  providers: [FaqService, FaqCommands, FaqComponents, FaqAutocompleteInterceptor],
})
export class FaqModule {}
