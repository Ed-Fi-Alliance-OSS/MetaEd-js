import { versionSatisfies, V3OrGreater } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace, GeneratorResult, GeneratedOutput } from '@edfi/metaed-core';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';

function fileName(projectPrefix: string): string {
  const prefix: string = projectPrefix === '' ? '' : `-${projectPrefix}`;
  return `ApiModel${prefix}.json`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];

  if (versionSatisfies(metaEd.dataStandardVersion, V3OrGreater)) {
    metaEd.namespace.forEach((namespace: Namespace) => {
      const structuredOutput = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;

      results.push({
        name: 'API Model',
        namespace: namespace.namespaceName,
        folderName: 'ApiMetadata',
        fileName: fileName(namespace.projectExtension),
        resultString: JSON.stringify(structuredOutput, null, 2).replace(/\\r\\n/g, ''),
        resultStream: null,
      });
    });
  }

  return {
    generatorName: 'edfiOdsApi.ApiModelGenerator',
    generatedOutput: results,
  };
}
