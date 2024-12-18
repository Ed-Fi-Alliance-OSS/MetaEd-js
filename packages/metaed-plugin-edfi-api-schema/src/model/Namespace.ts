import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { ApiSchema, newApiSchema } from './api-schema/ApiSchema';
import type { Document } from './OpenApiTypes';

export interface NamespaceEdfiApiSchema {
  apiSchema: ApiSchema;
  openApiSpecification: Document;
}

const enhancerName = 'NamespaceSetupEnhancer';

export function addNamespaceEdfiApiSchema(namespace: Namespace) {
  if (namespace.data.edfiApiSchema == null) namespace.data.edfiApiSchema = {};

  Object.assign(namespace.data.edfiApiSchema, {
    apiSchema: newApiSchema(),
    openApiSpecification: {},
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    addNamespaceEdfiApiSchema(namespace);
  });

  return {
    enhancerName,
    success: true,
  };
}
