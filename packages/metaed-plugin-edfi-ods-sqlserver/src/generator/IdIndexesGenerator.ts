import { orderByProp, versionSatisfies, GeneratedOutput, GeneratorResult, MetaEdEnvironment } from 'metaed-core';
import { shouldApplyLicenseHeader } from 'metaed-plugin-edfi-ods-relational';
import { tableEntities, Table } from 'metaed-plugin-edfi-ods-relational';
import { fileNameFor, structurePath, template } from './OdsGeneratorBase';

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const prefix: string = versionSatisfies(metaEd.dataStandardVersion, '2.x') ? '0009' : '0040';
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach((namespace) => {
    const tables: Table[] = orderByProp('tableId')(
      [...tableEntities(metaEd, namespace).values()].filter(
        (table: Table) => table.includeLastModifiedDateAndIdColumn && table.schema === namespace.namespaceName.toLowerCase(),
      ),
    );

    if (tables.length > 0) {
      const generatedResult: string = template().idIndexes({ tables, useLicenseHeader });

      results.push({
        name: 'ODS SQL Server Id Indexes',
        namespace: namespace.namespaceName,
        folderName: structurePath,
        fileName: fileNameFor(prefix, namespace, 'IdColumnUniqueIndexes'),
        resultString: generatedResult,
        resultStream: null,
      });
    }
  });

  return {
    generatorName: 'edfiOdsSqlServer.IdIndexesGenerator',
    generatedOutput: results,
  };
}
