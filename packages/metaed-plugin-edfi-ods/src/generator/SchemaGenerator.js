// @flow
import type { GeneratedOutput, GeneratorResult, MetaEdEnvironment, NamespaceInfo } from 'metaed-core';
import { template } from './OdsGeneratorBase';

function fileNameFor(namespaceInfo: NamespaceInfo): string {
  if (namespaceInfo.namespace === 'edfi') return '0001-Schemas.sql';

  const prefix: string = `0001-${namespaceInfo.projectExtension !== '' ? `${namespaceInfo.projectExtension}-` : ''}`;
  return `${prefix + namespaceInfo.namespace}-Schemas.sql`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];
  const namespaces: Array<NamespaceInfo> = metaEd.entity.namespaceInfo;

  namespaces.forEach(namespaceInfo => {
    const schemaName: string = namespaceInfo.namespace;
    const generatedResult: string = namespaceInfo.isExtension
        ? template().extensionSchema({ schemaName })
        : template().coreSchema({ schemaName });

    results.push({
      name: 'Schema SQL',
      folderName: 'ODS-SQLServer',
      fileName: fileNameFor(namespaceInfo),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOds.SchemaGenerator',
    generatedOutput: results,
  };
}
