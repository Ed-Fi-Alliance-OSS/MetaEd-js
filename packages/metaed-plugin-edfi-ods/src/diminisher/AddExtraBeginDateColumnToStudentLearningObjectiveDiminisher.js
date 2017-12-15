// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { addColumn } from '../model/database/Table';
import { getTable, renameForeignKeyColumn } from './DiminisherHelper';
import { newDateColumn } from '../model/database/Column';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { Column } from '../model/database/Column';
import type { Table } from '../model/database/Table';

// METAED-246
// EdFi ODS 2.0 has StudentLearningObjective with extra BeginDate
const enhancerName: string = 'AddExtraBeginDateColumnToStudentLearningObjectiveDiminisher';
const targetVersions: string = '2.0.x';

const studentLearningObjective: string = 'StudentLearningObjective';
const studentSectionAssociation: string = 'StudentSectionAssociation';
const beginDate: string = 'BeginDate';
const studentSectionAssociationBeginDate: string = studentSectionAssociation + beginDate;

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  const table: ?Table = getTable(pluginEnvironment(metaEd).entity, studentLearningObjective);
  if (table != null && table.columns.find((x: Column) => x.name === studentSectionAssociationBeginDate) == null) {
    const column: Column = Object.assign(newDateColumn(), {
      name: studentSectionAssociationBeginDate,
      isNullable: true,
    });
    addColumn(table, column);
    renameForeignKeyColumn(table, studentSectionAssociation, beginDate, beginDate, beginDate, studentSectionAssociationBeginDate);
  }

  return {
    enhancerName,
    success: true,
  };
}
