import { StringOption } from 'necord';

export type Trigger = {
  id: string;
  path: string;
  body: any;
  title: string;
  description: string;
  version?: string;
  hierarchy: string[];
};

export class TriggerDto {
  @StringOption({
    name: 'search',
    description: 'Search for a trigger',
    autocomplete: true,
    required: true,
  })
  search: string;
}
