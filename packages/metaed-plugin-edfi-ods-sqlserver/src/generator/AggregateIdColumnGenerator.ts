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

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsSqlServer') as PluginEnvironment;
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
        const generatedResult: string = template().aggregateIdColumns({ tables, useLicenseHeader });

        results.push({
          name: 'ODS SQL Server AggregateIdColumns',
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
    generatorName: 'edfiOdsSqlServer.AggregateIdColumnGenerator',
    generatedOutput: results,
  };
}
