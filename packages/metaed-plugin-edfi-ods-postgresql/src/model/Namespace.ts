import { EnhancerResult, MetaEdEnvironment, Namespace, newPluginEnvironment } from '@edfi/metaed-core';
import { newSchemaContainer } from './SchemaContainer';
import { SchemaContainer } from './SchemaContainer';

export interface NamespaceEdfiOdsPostgresql {
  odsSchema: SchemaContainer;
}

const enhancerName = 'NamespaceSetupEnhancer';

export function addNamespaceEdfiOdsPostgresqlTo(namespace: Namespace) {
  if (namespace.data.edfiOdsPostgresql == null) namespace.data.edfiOdsPostgresql = {};

  Object.assign(namespace.data.edfiOdsPostgresql as NamespaceEdfiOdsPostgresql, {
    odsSchema: newSchemaContainer(),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const edfiOdsPostgresqlPlugin = metaEd.plugin.get('edfiOdsPostgresql');
  if (edfiOdsPostgresqlPlugin == null) {
    metaEd.plugin.set('edfiOdsPostgresql', {
      ...newPluginEnvironment(),
      shortName: 'edfiOdsPostgresql',
    });
  }

  metaEd.namespace.forEach((namespace: Namespace) => {
    addNamespaceEdfiOdsPostgresqlTo(namespace);
  });

  return {
    enhancerName,
    success: true,
  };
}
