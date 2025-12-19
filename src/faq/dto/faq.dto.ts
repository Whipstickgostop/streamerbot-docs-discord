import { StringOption } from 'necord';

export type FaqItem = {
  id: string;
  path: string;
  title: string;
  description: string;
  body: string;
  icon?: string | null;
  version?: string | null;
  url?: string;

  // @deprecated
  images?: string[];

  // @deprecated
  youtubeId?: string;
};

export class FaqCommandDto {
  @StringOption({
    name: 'search',
    description: 'Search for a Frequently Asked Question',
    autocomplete: true,
    required: true,
  })
  search: string;
}
