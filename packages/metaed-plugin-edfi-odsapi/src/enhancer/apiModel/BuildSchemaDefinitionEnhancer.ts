import { MetaEdEnvironment, EnhancerResult, Namespace, SemVer, PluginEnvironment } from 'metaed-core';
import { versionSatisfies } from 'metaed-core';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { deriveLogicalNameFromProjectName } from '../../model/apiModel/SchemaDefinition';

const enhancerName = 'BuildSchemaDefinitionEnhancer';
const targetVersions: SemVer = '>=3.1.1';

// Schema definition is the database schema and project name for a namespace
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition.schemaDefinition = {
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
