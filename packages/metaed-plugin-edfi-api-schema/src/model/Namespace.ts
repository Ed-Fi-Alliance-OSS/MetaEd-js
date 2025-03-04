import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { ApiSchema, newApiSchema } from './api-schema/ApiSchema';
import { noDocument, type Document } from './OpenApiTypes';
import { OpenApiExtensionFragments } from './OpenApiExtensionFragments';

export type NamespaceEdfiApiSchema = {
  apiSchema: ApiSchema;
  openApiCoreResources: Document;
  openApiCoreDescriptors: Document;
  openApiExtensionResourceFragments: OpenApiExtensionFragments;
  openApiExtensionDescriptorFragments: OpenApiExtensionFragments;
};

const enhancerName = 'NamespaceSetupEnhancer';

export function addNamespaceEdfiApiSchema(namespace: Namespace) {
  if (namespace.data.edfiApiSchema == null) namespace.data.edfiApiSchema = {};

  Object.assign(namespace.data.edfiApiSchema, {
    apiSchema: newApiSchema(),
    openApiCoreResources: noDocument,
    openApiCoreDescriptors: noDocument,
    openApiExtensionResourceFragments: {},
    openApiExtensionDescriptorFragments: {},
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
