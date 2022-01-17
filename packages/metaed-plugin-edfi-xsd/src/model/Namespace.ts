import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { SchemaContainer } from './schema/SchemaContainer';
import { newSchemaContainer } from './schema/SchemaContainer';

export interface NamespaceEdfiXsd {
  xsdSchema: SchemaContainer;
}

const enhancerName = 'NamespaceSetupEnhancer';

export function addNamespaceEdfiXsdTo(namespace: Namespace) {
  if (namespace.data.edfiXsd == null) namespace.data.edfiXsd = {};

  Object.assign(namespace.data.edfiXsd, {
    xsdSchema: newSchemaContainer(),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    addNamespaceEdfiXsdTo(namespace);
  });

  return {
    enhancerName,
    success: true,
  };
}
