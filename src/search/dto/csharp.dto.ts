import { StringOption } from 'necord';

export type CSharpMethod = {
  type: 'c-sharp-method';
  name: string;
  signature: string;
  returnType: string;
  parameters: Array<{
    name: string;
    type: string;
    optional: boolean;
    defaultValue: string | null;
  }>;
  hierarchy: Array<string>;
  version: string;
  deprecated?: string;
};

export class CSharpCommandDto {
  @StringOption({
    name: 'search',
    description: 'Search for a C# method',
    autocomplete: true,
    required: true,
  })
  search: string;
}
