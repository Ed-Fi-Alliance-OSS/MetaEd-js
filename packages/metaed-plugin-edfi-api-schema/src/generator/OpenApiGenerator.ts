import { MetaEdEnvironment, GeneratorResult, GeneratedOutput, Namespace } from '@edfi/metaed-core';
import stringify from 'json-stable-stringify';

function fileName(projectPrefix: string): string {
  const prefix: string = projectPrefix === '' ? '' : `-${projectPrefix}`;
  return `OpenApi${prefix}.json`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    const swagger = {
      openapi: '3.0.1',
      info: {
        title: 'Ed-Fi Alliance Data Management Service',
        description: 'Ed-Fi Alliance Data Management Service',
        version: '0',
      },
      servers: [
        {
          url: 'http://localhost:5198/',
        },
      ],
    };

    results.push({
      name: 'DMS OpenApi Specification',
      namespace: namespace.namespaceName,
      folderName: 'OpenApi',
      fileName: fileName(namespace.projectExtension),
      resultString: stringify(swagger, { space: 2 }),
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiApiSchema.OpenApiGenerator',
    generatedOutput: results,
  };
}
