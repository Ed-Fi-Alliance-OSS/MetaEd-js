import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Column } from '../model/database/Column';
import { Table } from '../model/database/Table';

// METAED-249
// EdFi ODS 2.x missing StartTime from primary key of InterventionMeetingTime
const enhancerName = 'RemoveStartTimeFromPkOfInterventionMeetingTimeDiminisher';
const targetVersions = '2.x';

const interventionMeetingTime = 'InterventionMeetingTime';
const startTime = 'StartTime';

function modifyStartTimeColumnOnInterventionMeetingTimeTable(tablesForCoreNamespace: Map<string, Table>): void {
  const table: Table | undefined = tablesForCoreNamespace.get(interventionMeetingTime);
  if (table == null) return;

  const column: Column | undefined = table.columns.find((x: Column) => x.columnId === startTime);
  if (column == null) return;

  column.isPartOfPrimaryKey = false;
  column.isNullable = false;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  modifyStartTimeColumnOnInterventionMeetingTimeTable(tablesForCoreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
