import { newIntegerProperty, versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { addColumn } from '../model/database/Table';
import { rewriteColumnId } from './DiminisherHelper';
import { initializeColumn, newColumn, newColumnNameComponent } from '../model/database/Column';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Column } from '../model/database/Column';
import { ColumnPair } from '../model/database/ColumnPair';
import { ForeignKey } from '../model/database/ForeignKey';
import { Table } from '../model/database/Table';

// METAED-61
// Assessment.Version collides with AssessmentContentStandard.Version
// Rename ContentStandard.Version to ContentStandard.AssessmentVersion when ContentStandard hangs off of Assessment
const enhancerName = 'AssessmentContentStandardTableDiminisher';
const targetVersions = '2.0.0 || 2.0.1 || 3.0.0';

const assessmentContentStandard = 'AssessmentContentStandard';
const assessmentVersion = 'AssessmentVersion';
const version = 'Version';
const assessment = 'Assessment';
const assessmentContentStandardAuthor = 'AssessmentContentStandardAuthor';

function renameVersionColumnOnAssessmentContentStandardTable(tablesForCoreNamespace: Map<string, Table>): void {
  const table: Table | undefined = tablesForCoreNamespace.get(assessmentContentStandard);
  if (table == null) return;
  if (table.columns.find((column: Column) => column.columnId === assessmentVersion) != null) return;

  const column: Column | undefined = table.columns.find((x: Column) => x.columnId === version);
  if (column == null) return;

  const foreignKey: ForeignKey | undefined = table.foreignKeys.find((x: ForeignKey) => x.foreignTableId === assessment);
  if (foreignKey == null) return;

  const columnPair: ColumnPair | undefined = foreignKey.columnPairs.find(
    (x: ColumnPair) => x.parentTableColumnId === version && x.foreignTableColumnId === version,
  );
  if (columnPair == null) return;

  addColumn(
    table,
    initializeColumn(
      {
        ...newColumn(),
        type: 'integer',
      },
      {
        ...newIntegerProperty(),
        isPartOfIdentity: true,
        data: {
          edfiOdsRelational: {
            odsIsIdentityDatabaseType: false,
            odsIsUniqueIndex: false,
          },
        },
      },
      () => ({
        columnId: assessmentVersion,
        nameComponents: [{ ...newColumnNameComponent(), name: assessmentVersion, isSynthetic: true }],
      }),
      false,
    ),
  );

  column.isNullable = true;
  column.isPartOfPrimaryKey = false;
  columnPair.parentTableColumnId = assessmentVersion;
}

function renameVersionColumnOnAssessmentContentStandardAuthorTable(tablesForCoreNamespace: Map<string, Table>): void {
  const table: Table | undefined = tablesForCoreNamespace.get(assessmentContentStandardAuthor);
  if (table == null) return;
  if (table.columns.find((column: Column) => column.columnId === assessmentVersion) != null) return;

  const foreignKey: ForeignKey | undefined = table.foreignKeys.find(
    (x: ForeignKey) => x.foreignTableId === assessmentContentStandard,
  );
  if (foreignKey == null) return;

  const columnPair: ColumnPair | undefined = foreignKey.columnPairs.find(
    (x: ColumnPair) => x.parentTableColumnId === version && x.foreignTableColumnId === version,
  );
  if (columnPair == null) return;

  rewriteColumnId(table, version, assessmentVersion);

  columnPair.parentTableColumnId = assessmentVersion;
  columnPair.foreignTableColumnId = assessmentVersion;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  renameVersionColumnOnAssessmentContentStandardTable(tablesForCoreNamespace);
  renameVersionColumnOnAssessmentContentStandardAuthorTable(tablesForCoreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
