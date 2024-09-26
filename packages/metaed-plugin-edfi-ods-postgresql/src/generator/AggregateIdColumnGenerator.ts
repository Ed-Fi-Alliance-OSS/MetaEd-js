import {
  orderByProp,
  GeneratedOutput,
  GeneratorResult,
  MetaEdEnvironment,
  PluginEnvironment,
  versionSatisfies,
} from '@edfi/metaed-core';
import { shouldApplyLicenseHeader } from '@edfi/metaed-plugin-edfi-ods-relational';
import { tableEntities, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { fileNameFor, structurePath, template } from './OdsGeneratorBase';

type TableTemplate = {
  schema: string;
  tableName: string;
  indexName: string;
  sequenceName: string;
};

// Need to truncate index/sequence names to 63 characters max
const tableNameMaxLength = 54;
const tableNameMaxLengthBeforeHash = 47;

function indexNameFrom(table: Table): string {
  const { tableName } = table.data.edfiOdsPostgresql;
  const truncatedTableName: string =
    tableName.length <= tableNameMaxLength
      ? tableName
      : `${tableName.substring(0, tableNameMaxLengthBeforeHash)}_${table.data.edfiOdsPostgresql.truncatedTableNameHash}`;
  return `ix_${truncatedTableName}_aggid`;
}

function sequenceNameFrom(table: Table): string {
  const { tableName } = table.data.edfiOdsPostgresql;
  const truncatedTableName: string =
    tableName.length <= tableNameMaxLength
      ? tableName
      : `${tableName.substring(0, tableNameMaxLengthBeforeHash)}_${table.data.edfiOdsPostgresql.truncatedTableNameHash}`;
  return `${truncatedTableName}_aggseq`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsPostgresql') as PluginEnvironment;
  const results: GeneratedOutput[] = [];

  if (versionSatisfies(targetTechnologyVersion, '>=7.3.0')) {
    const prefix: string = '1460';
    const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

    metaEd.namespace.forEach((namespace) => {
      const tables: Table[] = orderByProp('tableId')(
        [...tableEntities(metaEd, namespace).values()].filter(
          (table: Table) => table.isAggregateRootTable && table.schema === namespace.namespaceName.toLowerCase(),
        ),
      );

      if (tables.length > 0) {
        const tableTemplates: TableTemplate[] = tables.map((table: Table) => ({
          schema: table.schema,
          tableName: table.data.edfiOdsPostgresql.tableName,
          indexName: indexNameFrom(table),
          sequenceName: sequenceNameFrom(table),
        }));

        const generatedResult: string = template().aggregateIdColumns({ tables: tableTemplates, useLicenseHeader });

        results.push({
          name: 'ODS PostgreSQL AggregateIdColumns',
          namespace: namespace.namespaceName,
          folderName: structurePath,
          fileName: fileNameFor(prefix, namespace, 'AggregateIdColumns'),
          resultString: generatedResult,
          resultStream: null,
        });
      }
    });
  }
  return {
    generatorName: 'edfiOdsPostgresql.AggregateIdColumnGenerator',
    generatedOutput: results,
  };
}
