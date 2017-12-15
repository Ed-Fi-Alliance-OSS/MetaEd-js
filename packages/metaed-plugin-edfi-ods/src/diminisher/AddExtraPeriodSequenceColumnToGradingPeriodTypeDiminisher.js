// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { addColumn } from '../model/database/Table';
import { getTable } from './DiminisherHelper';
import { newIntegerColumn } from '../model/database/Column';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { Column } from '../model/database/Column';
import type { Table } from '../model/database/Table';

// METAED-251
// EdFi ODS 2.0 has GradingPeriodType table with extra column
const enhancerName: string = 'AddExtraPeriodSequenceColumnToGradingPeriodTypeDiminisher';
const targetVersions: string = '2.0.x';

const gradingPeriodType: string = 'GradingPeriodType';
const periodSequence: string = 'PeriodSequence';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  const table: ?Table = getTable(pluginEnvironment(metaEd).entity, gradingPeriodType);
  if (table != null && table.columns.find((x: Column) => x.name === periodSequence) == null) {
    const column: Column = Object.assign(newIntegerColumn(), {
      name: periodSequence,
      isNullable: true,
    });
    addColumn(table, column);
  }

  return {
    enhancerName,
    success: true,
  };
}
