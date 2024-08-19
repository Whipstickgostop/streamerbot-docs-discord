import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { destr } from 'destr';
import { CSharpMethod } from './dto/csharp.dto';
import { SubAction } from './dto/sub-action.dto';
import { Trigger } from './dto/trigger.dto';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private docs: any[] = [];
  private subActions: SubAction[] = [];
  private triggers: Trigger[] = [];
  private csharpMethods: CSharpMethod[] = [];

  public onModuleInit() {
    this.fetchDocs();
    this.fetchCSharpMethods();
  }

  public getDocs() {
    return this.docs;
  }

  public getSubActions() {
    return this.subActions;
  }

  public getTriggers() {
    return this.triggers;
  }

  public getCsharpMethods() {
    return this.csharpMethods;
  }

  /**
   * Fetch the latest search data from the Streamer.bot docs
   */
  public async fetchDocs() {
    try {
      const res = await fetch('https://docs.streamer.bot/api/search.json', { cache: 'no-cache' });
      const data = await res.json();
      this.docs = data?.length ? data : this.docs;
      this.logger.log(`Fetched ${this.docs.length} docs`);

      this.subActions = this.docs.filter((doc) => doc._path.startsWith('/api/sub-actions/')).map(doc => ({
        ...doc,
        hierarchy: doc._path.split('/').slice(3, 4).map(part => part.replace(/-/g, ' ')).map(part => part.charAt(0).toUpperCase() + part.slice(1)),
      }));
      this.triggers = this.docs.filter((doc) => doc._path.startsWith('/api/triggers/')).map(doc => ({
        ...doc,
        hierarchy: doc._path.split('/').slice(3, 4).map(part => part.replace(/-/g, ' ')).map(part => part.charAt(0).toUpperCase() + part.slice(1)),
      }));

      return this.docs;
    } catch (e) {
      this.logger.error('Failed to fetch docs', e);
    }
  }

  /**
   * Fetch the latest csharp data from the Streamer.bot docs
   */
  public async fetchCSharpMethods() {
    try {
      const res = await fetch('https://docs.streamer.bot/api/manifest/csharp', { cache: 'no-cache' });
      const data = destr<{ methods: CSharpMethod[]; total: number }>(await res.text());
      this.csharpMethods = data?.methods?.length ? data?.methods.filter((method) => method.hierarchy?.length) : this.csharpMethods;
      this.csharpMethods.sort(
        (a, b) =>
          a.hierarchy[0]?.localeCompare(b.hierarchy[0]) ||
          a.hierarchy[1]?.localeCompare(b.hierarchy[1]) ||
          a.name.localeCompare(b.name),
      );
      this.logger.log(`Fetched ${data?.total ?? 0} C# methods`);

      return this.csharpMethods
    } catch (e) {
      this.logger.error('Failed to fetch C# methods', e);
    }
  }
}
