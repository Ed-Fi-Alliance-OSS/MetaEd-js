import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { OpenAPIV3 } from 'openapi-types';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const swaggerDocument: OpenAPIV3.Document = {
    openapi: '3.0.0',
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
    paths: {},
  };

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.data.openApiSpecification = swaggerDocument;
  });

  return {
    enhancerName: 'OpenApiSpecificationEnhancer',
    success: true,
  };
}
