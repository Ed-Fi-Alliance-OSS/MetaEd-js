import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Table } from '../model/database/Table';

// METAED-252, METAED-253
// LocalEducationAgencyFederalFunds has API top level resource columns
// StateEducationAgencyFederalFunds has API top level resource columns
const enhancerName = 'AddApiTopLevelResourceColumnsFromLeaAndStateFederalFundsDiminisher';
const targetVersions = '2.x';

const localEducationAgencyFederalFunds = 'LocalEducationAgencyLocalEducationAgencyFederalFunds';
const stateEducationAgencyFederalFunds = 'StateEducationAgencyStateEducationAgencyFederalFunds';

function addApiTopLevelResourceColumnsToLocalEducationAgencyFederalFundsTable(
  tablesForCoreNamespace: Map<string, Table>,
): void {
  const table: Table | undefined = tablesForCoreNamespace.get(localEducationAgencyFederalFunds);
  if (table == null) return;

  table.includeLastModifiedDateAndIdColumn = true;
}

function addApiTopLevelResourceColumnsToStateFederalFundsTable(tablesForCoreNamespace: Map<string, Table>): void {
  const table: Table | undefined = tablesForCoreNamespace.get(stateEducationAgencyFederalFunds);
  if (table == null) return;

  table.includeLastModifiedDateAndIdColumn = true;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  addApiTopLevelResourceColumnsToLocalEducationAgencyFederalFundsTable(tablesForCoreNamespace);
  addApiTopLevelResourceColumnsToStateFederalFundsTable(tablesForCoreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
