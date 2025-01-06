import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { ApiSchema, newApiSchema } from './api-schema/ApiSchema';
import { noDocument, type Document } from './OpenApiTypes';

export interface NamespaceEdfiApiSchema {
  apiSchema: ApiSchema;
  coreOpenApiSpecification: Document;
  openApiExtensionFragments: any;
}

const enhancerName = 'NamespaceSetupEnhancer';

export function addNamespaceEdfiApiSchema(namespace: Namespace) {
  if (namespace.data.edfiApiSchema == null) namespace.data.edfiApiSchema = {};

  Object.assign(namespace.data.edfiApiSchema, {
    apiSchema: newApiSchema(),
    coreOpenApiSpecification: noDocument,
    openApiExtensionFragments: {},
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
