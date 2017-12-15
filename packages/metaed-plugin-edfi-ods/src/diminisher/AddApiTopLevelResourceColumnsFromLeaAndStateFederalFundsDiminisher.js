// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { getTable } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { Table } from '../model/database/Table';

// METAED-252, METAED-253
// LocalEducationAgencyFederalFunds has API top level resource columns
// StateEducationAgencyFederalFunds has API top level resource columns
const enhancerName: string = 'AddApiTopLevelResourceColumnsFromLeaAndStateFederalFundsDiminisher';
const targetVersions: string = '2.0.x';

const localEducationAgencyFederalFunds: string = 'LocalEducationAgencyFederalFunds';
const stateEducationAgencyFederalFunds: string = 'StateEducationAgencyFederalFunds';

function addApiTopLevelResourceColumnsToLocalEducationAgencyFederalFundsTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, localEducationAgencyFederalFunds);
  if (table == null) return;

  table.includeLastModifiedDateAndIdColumn = true;
}

function addApiTopLevelResourceColumnsToStateFederalFundsTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, stateEducationAgencyFederalFunds);
  if (table == null) return;

  table.includeLastModifiedDateAndIdColumn = true;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  const repository: EdFiOdsEntityRepository = pluginEnvironment(metaEd).entity;
  addApiTopLevelResourceColumnsToLocalEducationAgencyFederalFundsTable(repository);
  addApiTopLevelResourceColumnsToStateFederalFundsTable(repository);

  return {
    enhancerName,
    success: true,
  };
}
