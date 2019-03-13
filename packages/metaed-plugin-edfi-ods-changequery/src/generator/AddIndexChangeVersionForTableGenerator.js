// @flow
import type { GeneratedOutput, GeneratorResult, MetaEdEnvironment } from 'metaed-core';
import { changeQueryIndicated } from '../enhancer/ChangeQueryIndicator';
import { changeQueryPath, template } from './ChangeQueryGeneratorBase';
import { addColumnChangeVersionForTableEntities } from '../enhancer/EnhancerHelper';
import type { AddColumnChangeVersionForTable } from '../model/AddColumnChangeVersionForTable';

const generatorName: string = 'edfiOdsChangeQuery.AddIndexChangeVersionForTableGenerator';

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];

  if (changeQueryIndicated(metaEd)) {
    metaEd.namespace.forEach(namespace => {
      const tables: Array<AddColumnChangeVersionForTable> = addColumnChangeVersionForTableEntities(metaEd, namespace);
      if (tables.length > 0) {
        tables.sort(
          // by schema then by table name
          (a: AddColumnChangeVersionForTable, b: AddColumnChangeVersionForTable) => {
            if (a.schema === b.schema) {
              if (a.tableName < b.tableName) return -1;
              return a.tableName > b.tableName ? 1 : 0;
            }
            return a.schema < b.schema ? -1 : 1;
          },
        );

        const generatedResult: string = template().addIndexChangeVersion({ tables });

        results.push({
          name: 'ODS Change Event: AddIndexChangeVersionForTable',
          namespace: namespace.namespaceName,
          folderName: changeQueryPath,
          fileName: '0070-AddIndexChangeVersionForTables.sql',
          resultString: generatedResult,
          resultStream: null,
        });
      }
    });
  }

  return {
    generatorName,
    generatedOutput: results,
  };
}
