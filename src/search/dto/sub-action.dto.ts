import { StringOption } from 'necord';

export type SubAction = {
  id: string;
  path: string;
  body: any;
  title: string;
  description: string;
  version?: string;
  hierarchy: string[];
};

export class SubActionDto {
  @StringOption({
    name: 'search',
    description: 'Search for a sub-action',
    autocomplete: true,
    required: true,
  })
  search: string;
}
