// @flow
import { newPluginEnvironment } from 'metaed-core';
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import type { EnumerationRow } from './database/EnumerationRow';
import type { SchoolYearEnumerationRow } from './database/SchoolYearEnumerationRow';
import type { Table } from './database/Table';
import type { Trigger } from './database/Trigger';

export type EdFiOdsEntityRepository = {
  table: Map<string, Table>,
  trigger: Map<string, Trigger>,
  row: Map<string, EnumerationRow | SchoolYearEnumerationRow>,
}

const enhancerName: string = 'EdFiOdsEntityRepositorySetupEnhancer';

export function newEdFiOdsEntityRepository(): EdFiOdsEntityRepository {
  return {
    table: new Map(),
    trigger: new Map(),
    row: new Map(),
  };
}

export function addEdFiOdsEntityRepositoryTo(metaEd: MetaEdEnvironment) {
  metaEd.plugin.set('edfiOds', Object.assign(newPluginEnvironment(), {
    entity: newEdFiOdsEntityRepository(),
  }));
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  addEdFiOdsEntityRepositoryTo(metaEd);

  return {
    enhancerName,
    success: true,
  };
}
