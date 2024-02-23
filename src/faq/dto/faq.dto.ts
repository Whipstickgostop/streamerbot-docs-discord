import { StringOption } from 'necord';

export type FaqItem = {
  _path: string;
  title: string;
  description: string;
  content: string;
  images?: string[];
}

export class FaqCommandDto {
  @StringOption({
    name: 'search',
    description: 'Search for a Frequently Asked Question',
    autocomplete: true,
    required: true,
  })
  search: string;
}