import { StringOption } from 'necord';

export type FaqItem = {
  _id: string;
  _path: string;
  _type: string;
  _source: string;
  _file: string;
  _extension: string;
  _draft: boolean;
  _partial: boolean;
  _locale: string;
  title: string;
  description: string;
  content: string;
  images?: string[];
  youtubeId?: string;
  index?: number;
  url?: string;
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
