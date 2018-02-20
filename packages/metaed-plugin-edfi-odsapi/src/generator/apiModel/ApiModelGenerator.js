// @flow
import type { MetaEdEnvironment, NamespaceInfo, GeneratorResult, GeneratedOutput } from 'metaed-core';
import type { NamespaceInfoEdfiOdsApi } from '../../model/NamespaceInfo';

function fileName(namespace: string, projectPrefix: string): string {
  const prefix: string = !projectPrefix ? '' : `-${projectPrefix}`;
  return `ApiModel${prefix}.json`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];
  const namespaces: Array<NamespaceInfo> = metaEd.entity.namespaceInfo;

  namespaces.forEach((namespaceInfo: NamespaceInfo) => {
    const structuredOutput = ((namespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi).domainModelDefinition;

    results.push({
      name: 'Domain Metadata',
      namespace: namespaceInfo.namespace,
      folderName: 'ApiMetadata',
      fileName: fileName(namespaceInfo.namespace, namespaceInfo.projectExtension),
      resultString: JSON.stringify(structuredOutput, null, 2),
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsApi.ApiModelGenerator',
    generatedOutput: results,
  };
}
