import { EnhancerResult, MetaEdEnvironment, Namespace, newPluginEnvironment } from '@edfi/metaed-core';
import { newSchemaContainer } from './SchemaContainer';
import { SchemaContainer } from './SchemaContainer';

export interface NamespaceEdfiOdsSqlServer {
  odsSchema: SchemaContainer;
}

const enhancerName = 'NamespaceSetupEnhancer';

export function addNamespaceEdfiOdsSqlServerTo(namespace: Namespace) {
  if (namespace.data.edfiOdsSqlServer == null) namespace.data.edfiOdsSqlServer = {};

  Object.assign(namespace.data.edfiOdsSqlServer, {
    odsSchema: newSchemaContainer(),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const edfiOdsSqlServerPlugin = metaEd.plugin.get('edfiOdsSqlServer');
  if (edfiOdsSqlServerPlugin == null) {
    metaEd.plugin.set('edfiOdsSqlServer', {
      ...newPluginEnvironment(),
      shortName: 'edfiOdsSqlServer',
    });
  }

  metaEd.namespace.forEach((namespace: Namespace) => {
    addNamespaceEdfiOdsSqlServerTo(namespace);
  });

  return {
    enhancerName,
    success: true,
  };
}
