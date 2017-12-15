// @flow
import { newIntegerProperty } from 'metaed-core';
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { addColumn, getForeignKeys } from '../model/database/Table';
import { getTable, renameColumn } from './DiminisherHelper';
import { initializeColumn, newIntegerColumn } from '../model/database/Column';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { Column } from '../model/database/Column';
import type { ColumnNamePair } from '../model/database/ColumnNamePair';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { Table } from '../model/database/Table';

// METAED-61
// Assessment.Version collides with AssessmentContentStandard.Version
// Rename ContentStandard.Version to ContentStandard.AssessmentVersion when ContentStandard hangs off of Assessment
// Necessary for EdFi ODS 2.x in order to generate valid SQL
const enhancerName: string = 'AssessmentContentStandardTableDiminisher';
// const targetVersions: string = '2.x';

const assessmentContentStandard: string = 'AssessmentContentStandard';
const assessmentVersion: string = 'AssessmentVersion';
const version: string = 'Version';
const assessment: string = 'Assessment';
const assessmentContentStandardAuthor: string = 'AssessmentContentStandardAuthor';

function renameVersionColumnOnAssessmentContentStandardTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, assessmentContentStandard);
  if (table == null) return;
  if (table.columns.find((column: Column) => column.name === assessmentVersion) != null) return;

  addColumn(table, initializeColumn(
    newIntegerColumn(),
    Object.assign(newIntegerProperty(), {
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    }),
    () => assessmentVersion,
    false,
  ));

  const column: ?Column = table.columns.find((x: Column) => x.name === version);
  if (column == null) return;
  column.isNullable = true;
  column.isPartOfPrimaryKey = false;

  const foreignKey: ?ForeignKey = getForeignKeys(table).find((x: ForeignKey) => x.foreignTableName === assessment);
  if (foreignKey == null) return;
  const columnNamePair: ?ColumnNamePair = foreignKey.columnNames.find(
    (x: ColumnNamePair) => x.parentTableColumnName === version && x.foreignTableColumnName === version,
  );
  if (columnNamePair == null) return;
  columnNamePair.parentTableColumnName = assessmentVersion;
}

function renameVersionColumnOnAssessmentContentStandardAuthorTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, assessmentContentStandardAuthor);
  if (table == null) return;
  if (table.columns.find((column: Column) => column.name === assessmentVersion) != null) return;

  renameColumn(table, version, assessmentVersion);

  const foreignKey: ?ForeignKey = getForeignKeys(table).find(
    (x: ForeignKey) => x.foreignTableName === assessmentContentStandard,
  );
  if (foreignKey == null) return;
  const columnNamePair: ?ColumnNamePair = foreignKey.columnNames.find(
    (x: ColumnNamePair) => x.parentTableColumnName === version && x.foreignTableColumnName === version,
  );
  if (columnNamePair == null) return;
  columnNamePair.parentTableColumnName = assessmentVersion;
  columnNamePair.foreignTableColumnName = assessmentVersion;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  renameVersionColumnOnAssessmentContentStandardTable(pluginEnvironment(metaEd).entity);
  renameVersionColumnOnAssessmentContentStandardAuthorTable(pluginEnvironment(metaEd).entity);

  return {
    enhancerName,
    success: true,
  };
}
