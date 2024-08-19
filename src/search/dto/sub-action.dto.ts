import { StringOption } from 'necord';

export type SubAction = {
  _path: string;
  _dir: string;
  _draft: boolean;
  _partial: boolean;
  _locale: string;
  _type: string;
  _id: string;
  _source: string;
  _file: string;
  _stem: string;
  _extension: string;
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
