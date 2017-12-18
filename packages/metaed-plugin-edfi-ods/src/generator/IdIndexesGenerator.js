// @flow
import { orderByProp } from 'metaed-core';
import type { GeneratedOutput, GeneratorResult, MetaEdEnvironment, NamespaceInfo } from 'metaed-core';
import { template } from './OdsGeneratorBase';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { Table } from '../model/database/Table';

function fileNameFor(namespaceInfo: NamespaceInfo): string {
  if (namespaceInfo.namespace === 'edfi') return '0009-IdColumnUniqueIndexes.sql';

  const prefix: string = `0009-${namespaceInfo.projectExtension !== '' ? `${namespaceInfo.projectExtension}-` : ''}`;
  return `${prefix + namespaceInfo.namespace}-IdColumnUniqueIndexes.sql`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];
  const namespaces: Array<NamespaceInfo> = metaEd.entity.namespaceInfo;

  namespaces.forEach(namespaceInfo => {
    const tables: Array<Table> = orderByProp('name')(
      [...pluginEnvironment(metaEd).entity.table.values()].filter(
        (table: Table) => table.includeLastModifiedDateAndIdColumn && table.schema === namespaceInfo.namespace,
      ),
    );
    if (tables.length > 0) {
      const generatedResult: string = template().idIndexes({ tables });

      results.push({
        name: 'Id Indexes SQL',
        folderName: 'ODS-SQLServer',
        fileName: fileNameFor(namespaceInfo),
        resultString: generatedResult,
        resultStream: null,
      });
    }
  });

  return {
    generatorName: 'edfiOds.IdIndexesGenerator',
    generatedOutput: results,
  };
}
