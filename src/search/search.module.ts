import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchCommands } from './search.commands';
import { CSharpMethodAutocompleteInterceptor } from './interceptors/csharp.interceptor';
import { FaqModule } from '../faq/faq.module';

@Module({
  imports: [FaqModule],
  providers: [SearchService, SearchCommands, CSharpMethodAutocompleteInterceptor],
  exports: [SearchService]
})
export class SearchModule {}
