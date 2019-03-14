// @flow
import type { MetaEdEnvironment, PluginEnvironment, EnhancerResult, Namespace, SemVer } from 'metaed-core';
import { versionSatisfies } from 'metaed-core';
import type { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { deriveLogicalNameFromProjectName } from '../../model/apiModel/SchemaDefinition';

const enhancerName = 'BuildSchemaDefinitionEnhancer';
const targetVersions: SemVer = '>=3.1.1';

// Schema definition is the database schema and project name for a namespace
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const edfiOdsPlugin: ?PluginEnvironment = metaEd.plugin.get('edfiOds');
  if (edfiOdsPlugin == null || !versionSatisfies(edfiOdsPlugin.targetTechnologyVersion, targetVersions))
    return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    ((namespace.data.edfiOdsApi: any): NamespaceEdfiOdsApi).domainModelDefinition.schemaDefinition = {
      logicalName: deriveLogicalNameFromProjectName(namespace.projectName),
      physicalName: namespace.namespaceName.toLowerCase(),
      version: namespace.projectVersion,
    };
  });

  return {
    enhancerName,
    success: true,
  };
}
