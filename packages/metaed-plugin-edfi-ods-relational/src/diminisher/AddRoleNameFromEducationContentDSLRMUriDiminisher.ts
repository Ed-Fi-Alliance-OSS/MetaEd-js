import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Column, StringColumn, newColumnNameComponent } from '../model/database/Column';
import { Table } from '../model/database/Table';

// METAED-247
// Ed-Fi ODS 2.x EducationContentDerivativeSourceLearningResourceMetadataURI and EducationContentDerivativeSourceURI
// tables need DerivativeSource context on URI column

// METAED-261
// Datatype mismatch
const enhancerName = 'AddRoleNameFromEducationContentDSLRMUriDiminisher';
const targetVersions = '2.x';

const derivativeSourceLearningResourceMetadataURI = 'DerivativeSourceLearningResourceMetadataURI';
const derivativeSourceURI = 'DerivativeSourceURI';
const educationContentDerivativeSourceLearningResourceMetadataURI =
  'EducationContentDerivativeSourceLearningResourceMetadataURI';
const educationContentDerivativeSourceURI = 'EducationContentDerivativeSourceURI';
const learningResourceMetadataURI = 'LearningResourceMetadataURI';
const uri = 'URI';

function renameAndTruncateEducationContentDerivativeSourceLearningResourceMetadataURI(
  tablesForCoreNamespace: Map<string, Table>,
): void {
  const table: Table | undefined = tablesForCoreNamespace.get(educationContentDerivativeSourceLearningResourceMetadataURI);
  if (table == null) return;
  if (table.columns.find((column: Column) => column.columnId === learningResourceMetadataURI) != null) return;

  const column: Column | undefined = table.columns.find(
    (x: Column) => x.columnId === derivativeSourceLearningResourceMetadataURI,
  );
  if (column == null) return;

  column.columnId = learningResourceMetadataURI;
  column.nameComponents = [{ ...newColumnNameComponent(), name: learningResourceMetadataURI, isSynthetic: true }];
  column.type = 'string';
  (column as StringColumn).maxLength = '225';
}

function renameAndTruncateEducationContentDerivativeSourceURI(tablesForCoreNamespace: Map<string, Table>): void {
  const table: Table | undefined = tablesForCoreNamespace.get(educationContentDerivativeSourceURI);
  if (table == null) return;
  if (table.columns.find((column: Column) => column.columnId === uri) != null) return;

  const column: Column | undefined = table.columns.find((x: Column) => x.columnId === derivativeSourceURI);
  if (column == null) return;

  column.columnId = uri;
  column.nameComponents = [{ ...newColumnNameComponent(), name: uri, isSynthetic: true }];
  column.type = 'string';
  (column as StringColumn).maxLength = '225';
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  renameAndTruncateEducationContentDerivativeSourceLearningResourceMetadataURI(tablesForCoreNamespace);
  renameAndTruncateEducationContentDerivativeSourceURI(tablesForCoreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
