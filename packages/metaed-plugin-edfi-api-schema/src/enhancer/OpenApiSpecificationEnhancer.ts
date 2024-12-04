import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
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

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.data.openApiSpecification = swagger;
  });

  return {
    enhancerName: 'OpenApiSpecificationEnhancer',
    success: true,
  };
}
