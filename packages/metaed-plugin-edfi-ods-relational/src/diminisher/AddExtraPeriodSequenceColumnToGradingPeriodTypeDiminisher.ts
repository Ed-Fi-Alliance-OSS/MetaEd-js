import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { addColumn } from '../model/database/Table';
import { newColumn, newColumnNameComponent } from '../model/database/Column';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Column } from '../model/database/Column';
import { Table } from '../model/database/Table';

// METAED-251
// EdFi ODS 2.x has GradingPeriodType table with extra column
const enhancerName = 'AddExtraPeriodSequenceColumnToGradingPeriodTypeDiminisher';
const targetVersions = '2.x';

const gradingPeriodType = 'GradingPeriodType';
const periodSequence = 'PeriodSequence';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  const table: Table | undefined = tablesForCoreNamespace.get(gradingPeriodType);
  if (table != null && table.columns.find((x: Column) => x.columnId === periodSequence) == null) {
    const column: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: periodSequence,
      nameComponents: [{ ...newColumnNameComponent(), name: periodSequence, isSynthetic: true }],
      isNullable: true,
    };
    addColumn(table, column);
  }

  return {
    enhancerName,
    success: true,
  };
}
