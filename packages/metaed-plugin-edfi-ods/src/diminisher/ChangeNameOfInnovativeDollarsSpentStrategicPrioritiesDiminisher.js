// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { getTable, renameColumn } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { Column } from '../model/database/Column';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { Table } from '../model/database/Table';

// METAED-248
// EdFi ODS 2.0 naming of InnovativeDollarsSpentStrategicPriorities mismatch with XSD
const enhancerName: string = 'ChangeNameOfInnovativeDollarsSpentStrategicPrioritiesDiminisher';
const targetVersions: string = '2.0.x';

const innovativeDollarsSpentOnStrategicPriorities: string = 'InnovativeDollarsSpentOnStrategicPriorities';
const innovativeDollarsSpentStrategicPriorities: string = 'InnovativeDollarsSpentStrategicPriorities';
const localEducationAgencyFederalFunds: string = 'LocalEducationAgencyFederalFunds';

function changeNameOfInnovativeDollarsSpentStrategicPriorities(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, localEducationAgencyFederalFunds);
  if (table == null) return;
  if (table.columns.find((column: Column) => column.name === innovativeDollarsSpentOnStrategicPriorities) != null) return;

  renameColumn(table, innovativeDollarsSpentStrategicPriorities, innovativeDollarsSpentOnStrategicPriorities);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  changeNameOfInnovativeDollarsSpentStrategicPriorities(pluginEnvironment(metaEd).entity);

  return {
    enhancerName,
    success: true,
  };
}
