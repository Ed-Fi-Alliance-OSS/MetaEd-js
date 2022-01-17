import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Column, StringColumn } from '../model/database/Column';
import { Table } from '../model/database/Table';

// METAED-261
// Datatype mismatches
const enhancerName = 'ModifyStringColumnLengthDiminisher';
const targetVersions = '2.x';

const modifyStringColumnLength =
  (tablesForCoreNamespace: Map<string, Table>) =>
  (tableName: string, columnName: string, length: string): void => {
    const table: Table | undefined = tablesForCoreNamespace.get(tableName);
    if (table == null) return;

    const column: Column | undefined = table.columns.find((x: Column) => x.columnId === columnName);
    if (column == null) return;
    (column as StringColumn).length = length;
  };

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  const modifyStringColumnLengthFor = modifyStringColumnLength(tablesForCoreNamespace);
  modifyStringColumnLengthFor('EducationContentAuthor', 'Author', '225');
  modifyStringColumnLengthFor('EducationOrganizationCategoryType', 'CodeValue', '75');

  return {
    enhancerName,
    success: true,
  };
}
