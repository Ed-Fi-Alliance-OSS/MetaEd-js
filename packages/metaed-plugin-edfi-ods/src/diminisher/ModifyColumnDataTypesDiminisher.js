// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { ColumnDataTypes } from '../model/database/ColumnDataTypes';
import { getTable } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { Column, StringColumn } from '../model/database/Column';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { Table } from '../model/database/Table';

// METAED-261
// Datatype mismatches
const enhancerName: string = 'ModifyColumnDataTypesDiminisher';
const targetVersions: string = '2.0.x';

const modifyColumnDataTypes = (repository: EdFiOdsEntityRepository) =>
  (tableName: string, columnName: string, dataType: string): void => {
    const table: ?Table = getTable(repository, tableName);
    if (table == null) return;

    const column: ?Column = table.columns.find((x: Column) => x.name === columnName);
    if (column == null) return;
    column.dataType = dataType;
  };

const modifyStringColumnLength = (repository: EdFiOdsEntityRepository) =>
(tableName: string, columnName: string, length: string): void => {
  const table: ?Table = getTable(repository, tableName);
  if (table == null) return;

  const column: ?Column = table.columns.find((x: Column) => x.name === columnName);
  if (column == null) return;
  column.dataType = ColumnDataTypes.string(length);
  ((column: any): StringColumn).length = length;
};

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  const modifyColumnDataTypesFor = modifyColumnDataTypes(pluginEnvironment(metaEd).entity);
  modifyColumnDataTypesFor('StudentIndicator', 'BeginDate', '[DATETIME]');
  modifyColumnDataTypesFor('StudentIndicator', 'EndDate', '[DATETIME]');
  modifyColumnDataTypesFor('StudentProgramParticipation', 'BeginDate', '[DATETIME]');
  modifyColumnDataTypesFor('StudentProgramParticipation', 'EndDate', '[DATETIME]');

  const modifyStringColumnLengthFor = modifyStringColumnLength(pluginEnvironment(metaEd).entity);
  modifyStringColumnLengthFor('EducationContentAuthor', 'Author', '225');
  modifyStringColumnLengthFor('EducationOrganizationCategoryType', 'CodeValue', '75');

  return {
    enhancerName,
    success: true,
  };
}
