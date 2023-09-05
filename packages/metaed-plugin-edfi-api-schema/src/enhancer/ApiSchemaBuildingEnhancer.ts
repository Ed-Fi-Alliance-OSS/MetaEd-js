import {
  MetaEdEnvironment,
  EnhancerResult,
  getEntitiesOfTypeForNamespaces,
  Namespace,
  PluginEnvironment,
  DomainEntity,
  TopLevelEntity,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { PluginEnvironmentEdfiApiSchema } from '../model/PluginEnvironment';
import { ProjectSchema } from '../model/api-schema/ProjectSchema';
import { SemVer } from '../model/api-schema/SemVer';
import { ResourceSchema } from '../model/api-schema/ResourceSchema';
import { ResourceSchemaMapping } from '../model/api-schema/ResourceSchemaMapping';

/**
 *
 */
function buildResourceSchema(entity: TopLevelEntity): ResourceSchema {
  const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  return {
    resourceName: entityApiSchemaData.resourceName,
    isDescriptor: entity.type === 'descriptor',
    allowIdentityUpdates: entity.allowPrimaryKeyUpdates,
    jsonSchemaForInsert: entityApiSchemaData.jsonSchemaForInsert,
    jsonSchemaForUpdate: entityApiSchemaData.jsonSchemaForUpdate,
    jsonSchemaForQuery: entityApiSchemaData.jsonSchemaForQuery,
    equalityConstraints: entityApiSchemaData.equalityConstraints,
    identityFullnames: entityApiSchemaData.identityFullnames,
    documentPathsMapping: entityApiSchemaData.documentPathsMapping,
  };
}
/**
 * This enhancer uses the results of the other enhancers to build the API Schema object
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { apiSchema } = (metaEd.plugin.get('edfiApiSchema') as PluginEnvironment).data as PluginEnvironmentEdfiApiSchema;

  Array.from(metaEd.namespace.values()).forEach((namespace: Namespace) => {
    const resourceSchemaMapping: ResourceSchemaMapping = {};

    const projectSchema: ProjectSchema = {
      projectName: namespace.projectName,
      projectVersion: namespace.projectVersion as SemVer,
      isExtensionProject: namespace.isExtension,
      description: namespace.projectDescription,
      resourceSchemaMapping,
    };

    apiSchema.projects.push(projectSchema);

    getEntitiesOfTypeForNamespaces([namespace], 'domainEntity').forEach((domainEntity) => {
      // Abstract entities are not resources (e.g. EducationOrganization)
      if ((domainEntity as DomainEntity).isAbstract) return;
      resourceSchemaMapping[(domainEntity.data.edfiApiSchema as EntityApiSchemaData).endpointName] = buildResourceSchema(
        domainEntity as TopLevelEntity,
      );
    });

    getEntitiesOfTypeForNamespaces([namespace], 'association').forEach((association) => {
      // This is a workaround for the fact that the ODS/API required GeneralStudentProgramAssociation to
      // be abstract although there is no MetaEd language annotation to make an Association abstract.
      if (association.metaEdName !== 'GeneralStudentProgramAssociation') return;
      resourceSchemaMapping[(association.data.edfiApiSchema as EntityApiSchemaData).endpointName] = buildResourceSchema(
        association as TopLevelEntity,
      );
    });

    getEntitiesOfTypeForNamespaces([namespace], 'domainEntitySubclass', 'associationSubclass', 'descriptor').forEach(
      (entity) => {
        resourceSchemaMapping[(entity.data.edfiApiSchema as EntityApiSchemaData).endpointName] = buildResourceSchema(
          entity as TopLevelEntity,
        );
      },
    );
  });
  return {
    enhancerName: 'ApiSchemaBuildingEnhancer',
    success: true,
  };
}
