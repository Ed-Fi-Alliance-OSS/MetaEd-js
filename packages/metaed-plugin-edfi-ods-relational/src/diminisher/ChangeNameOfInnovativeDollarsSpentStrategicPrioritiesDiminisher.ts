import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { rewriteColumnId } from './DiminisherHelper';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Column } from '../model/database/Column';
import { Table } from '../model/database/Table';

// METAED-248
// EdFi ODS 2.x naming of InnovativeDollarsSpentStrategicPriorities mismatch with XSD
const enhancerName = 'ChangeNameOfInnovativeDollarsSpentStrategicPrioritiesDiminisher';
const targetVersions = '2.x';

const innovativeDollarsSpentOnStrategicPriorities = 'InnovativeDollarsSpentOnStrategicPriorities';
const innovativeDollarsSpentStrategicPriorities = 'InnovativeDollarsSpentStrategicPriorities';
const localEducationAgencyFederalFunds = 'LocalEducationAgencyLocalEducationAgencyFederalFunds';

function changeNameOfInnovativeDollarsSpentStrategicPriorities(tablesForCoreNamespace: Map<string, Table>): void {
  const table: Table | undefined = tablesForCoreNamespace.get(localEducationAgencyFederalFunds);
  if (table == null) return;
  if (table.columns.find((column: Column) => column.columnId === innovativeDollarsSpentOnStrategicPriorities) != null)
    return;

  rewriteColumnId(table, innovativeDollarsSpentStrategicPriorities, innovativeDollarsSpentOnStrategicPriorities);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  changeNameOfInnovativeDollarsSpentStrategicPriorities(tablesForCoreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
