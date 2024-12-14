import { MetaEdEnvironment, GeneratorResult, GeneratedOutput, Namespace } from '@edfi/metaed-core';
import stringify from 'json-stable-stringify';

function fileName(projectPrefix: string): string {
  const prefix: string = projectPrefix === '' ? '' : `-${projectPrefix}`;
  return `OpenApi${prefix}.json`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    const { openApiSpecification } = namespace.data.edfiApiSchema;

    results.push({
      name: 'DMS OpenApi Specification',
      namespace: namespace.namespaceName,
      folderName: 'OpenApi',
      fileName: fileName(namespace.projectExtension),
      resultString: stringify(openApiSpecification, { space: 2 }),
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiApiSchema.OpenApiGenerator',
    generatedOutput: results,
  };
}
