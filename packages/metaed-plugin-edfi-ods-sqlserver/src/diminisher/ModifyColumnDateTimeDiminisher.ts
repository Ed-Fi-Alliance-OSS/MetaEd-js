import { versionSatisfies } from 'metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from 'metaed-core';
import { tableEntities, Column, Table } from 'metaed-plugin-edfi-ods-relational';

// METAED-261
// Datatype mismatches
const enhancerName = 'ModifyColumnDateTimeDiminisher';
const targetVersions = '2.x';

const modifyColumnDataTypes =
  (tablesForCoreNamespace: Map<string, Table>) =>
  (tableName: string, columnId: string, dataType: string): void => {
    const table: Table | undefined = tablesForCoreNamespace.get(tableName);
    if (table == null) return;

    const column: Column | undefined = table.columns.find((x: Column) => x.columnId === columnId);
    if (column == null) return;
    if (column.data.edfiOdsSqlServer == null) column.data.edfiOdsSqlServer = {};
    column.data.edfiOdsSqlServer.dataType = dataType;
  };

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  const modifyColumnDataTypesFor = modifyColumnDataTypes(tablesForCoreNamespace);
  modifyColumnDataTypesFor('StudentStudentIndicator', 'BeginDate', '[DATETIME]');
  modifyColumnDataTypesFor('StudentStudentIndicator', 'EndDate', '[DATETIME]');
  modifyColumnDataTypesFor('StudentProgramParticipation', 'BeginDate', '[DATETIME]');
  modifyColumnDataTypesFor('StudentProgramParticipation', 'EndDate', '[DATETIME]');

  return {
    enhancerName,
    success: true,
  };
}
