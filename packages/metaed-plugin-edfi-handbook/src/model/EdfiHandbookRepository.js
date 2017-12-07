// @flow
import type { MetaEdEnvironment, EnhancerResult } from 'metaed-core';
import { newPluginEnvironment } from 'metaed-core';
import type { HandbookEntry } from './HandbookEntry';

export type EdfiHandbookRepository = {
  handbookEntries: Array<HandbookEntry>,
};
const enhancerName: string = 'EdfiHandbookRepositorySetupEnhancer';

export function newEdfiHandbookRepository(): EdfiHandbookRepository {
  return {
    handbookEntries: [],
  };
}

export function addEdfiHandbookRepositoryTo(metaEd: MetaEdEnvironment) {
  metaEd.plugin.set('edfiHandbook', Object.assign(newPluginEnvironment(), {
    entity: newEdfiHandbookRepository(),
  }));
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  addEdfiHandbookRepositoryTo(metaEd);
  return {
    enhancerName,
    success: true,
  };
}
