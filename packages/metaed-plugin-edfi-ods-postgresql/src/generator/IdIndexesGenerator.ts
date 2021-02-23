import {
  orderByProp,
  GeneratedOutput,
  GeneratorResult,
  MetaEdEnvironment,
  versionSatisfies,
  PluginEnvironment,
} from 'metaed-core';
import { tableEntities, Table } from 'metaed-plugin-edfi-ods-relational';
import { fileNameFor, structurePath, template } from './OdsGeneratorBase';

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const prefix: string = versionSatisfies(metaEd.dataStandardVersion, '2.x') ? '0009' : '0040';
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  const useLicenseHeader = metaEd.allianceMode && versionSatisfies(targetTechnologyVersion, '>=5.0.0');

  metaEd.namespace.forEach(namespace => {
    const tables: Table[] = orderByProp('tableId')(
      [...tableEntities(metaEd, namespace).values()].filter(
        (table: Table) => table.includeLastModifiedDateAndIdColumn && table.schema === namespace.namespaceName.toLowerCase(),
      ),
    );

    if (tables.length > 0) {
      const generatedResult: string = template({}).idIndexes({ tables, useLicenseHeader });

      results.push({
        name: 'ODS PostgreSQL Id Indexes',
        namespace: namespace.namespaceName,
        folderName: structurePath,
        fileName: fileNameFor(prefix, namespace, 'IdColumnUniqueIndexes'),
        resultString: generatedResult,
        resultStream: null,
      });
    }
  });

  return {
    generatorName: 'edfiOdsPostgresql.IdIndexesGenerator',
    generatedOutput: results,
  };
}
