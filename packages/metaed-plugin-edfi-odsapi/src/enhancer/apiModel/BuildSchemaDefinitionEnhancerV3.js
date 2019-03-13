// @flow

import type { MetaEdEnvironment, EnhancerResult, Namespace, SemVer } from 'metaed-core';
import { versionSatisfies } from 'metaed-core';
import type { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { deriveLogicalNameFromProjectName } from '../../model/apiModel/SchemaDefinition';

const enhancerName = 'BuildSchemaDefinitionEnhancerV3';
const targetVersions: SemVer = '<3.1.1';

// Schema definition is the database schema and project name for a namespace
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    ((namespace.data.edfiOdsApi: any): NamespaceEdfiOdsApi).domainModelDefinition.schemaDefinition = {
      logicalName: deriveLogicalNameFromProjectName(namespace.projectName),
      physicalName: namespace.namespaceName.toLowerCase(),
    };
  });

  return {
    enhancerName,
    success: true,
  };
}
