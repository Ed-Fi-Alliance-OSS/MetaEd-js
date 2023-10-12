import { invariant } from 'ts-invariant';
import {
  MetaEdEnvironment,
  EnhancerResult,
  getEntitiesOfTypeForNamespaces,
  Namespace,
  PluginEnvironment,
  DomainEntity,
  TopLevelEntity,
  EntityProperty,
  DomainEntitySubclass,
  AssociationSubclass,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { PluginEnvironmentEdfiApiSchema } from '../model/PluginEnvironment';
import { ProjectSchema } from '../model/api-schema/ProjectSchema';
import { SemVer } from '../model/api-schema/SemVer';
import { ResourceSchema } from '../model/api-schema/ResourceSchema';
import { ResourceSchemaMapping } from '../model/api-schema/ResourceSchemaMapping';
import { ProjectNamespace } from '../model/api-schema/ProjectNamespace';
import { MetaEdProjectName } from '../model/api-schema/MetaEdProjectName';
import { MetaEdPropertyFullName } from '../model/api-schema/MetaEdPropertyFullName';

/**
 *
 */
function buildResourceSchema(entity: TopLevelEntity): ResourceSchema {
  const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  return {
    resourceName: entityApiSchemaData.resourceName,
    isDescriptor: entity.type === 'descriptor',
    isSchoolYearEnumeration: entity.type === 'schoolYearEnumeration',
    allowIdentityUpdates: entity.allowPrimaryKeyUpdates,
    jsonSchemaForInsert: entityApiSchemaData.jsonSchemaForInsert,
    jsonSchemaForUpdate: entityApiSchemaData.jsonSchemaForUpdate,
    jsonSchemaForQuery: entityApiSchemaData.jsonSchemaForQuery,
    equalityConstraints: entityApiSchemaData.equalityConstraints,
    identityFullnames: entityApiSchemaData.identityFullnames,
    documentPathsMapping: entityApiSchemaData.documentPathsMapping,
    identityPathOrder: entityApiSchemaData.identityPathOrder,
    isSubclass: false,
  };
}

/**
 * Includes DomainEntity superclass information in the ResourceSchema
 */
function buildDomainEntitySubclassResourceSchema(entity: DomainEntitySubclass): ResourceSchema {
  const baseResourceSchema: ResourceSchema = buildResourceSchema(entity);

  invariant(entity.baseEntity != null, `Domain Entity Subclass ${entity.metaEdName} must have a base entity`);
  const superclassEntityApiSchemaData = entity.baseEntity.data.edfiApiSchema as EntityApiSchemaData;

  const subclassIdentityRenameProperty: EntityProperty | undefined = entity.properties.find((p) => p.isIdentityRename);
  invariant(
    subclassIdentityRenameProperty != null,
    `Domain Entity Subclass ${entity.metaEdName} must have an identity rename property`,
  );

  return {
    ...baseResourceSchema,
    superclassProjectName: entity.baseEntity.namespace.projectName as MetaEdProjectName,
    superclassResourceName: superclassEntityApiSchemaData.resourceName,
    superclassIdentityFullname: subclassIdentityRenameProperty.baseKeyName as MetaEdPropertyFullName,
    subclassIdentityFullname: subclassIdentityRenameProperty.fullPropertyName as MetaEdPropertyFullName,
    isSubclass: true,
    subclassType: 'domainEntity',
  };
}

/**
 * Includes Association superclass information in the ResourceSchema
 */
function buildAssociationSubclassResourceSchema(entity: AssociationSubclass): ResourceSchema {
  const baseResourceSchema: ResourceSchema = buildResourceSchema(entity);

  invariant(entity.baseEntity != null, `Association Subclass ${entity.metaEdName} must have a base entity`);
  const superclassEntityApiSchemaData = entity.baseEntity.data.edfiApiSchema as EntityApiSchemaData;

  return {
    ...baseResourceSchema,
    superclassProjectName: entity.baseEntity.namespace.projectName as MetaEdProjectName,
    superclassResourceName: superclassEntityApiSchemaData.resourceName,
    isSubclass: true,
    subclassType: 'association',
  };
}

/**
 * This enhancer uses the results of the other enhancers to build the API Schema object
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { apiSchema } = (metaEd.plugin.get('edfiApiSchema') as PluginEnvironment).data as PluginEnvironmentEdfiApiSchema;

  Array.from(metaEd.namespace.values()).forEach((namespace: Namespace) => {
    const resourceSchemas: ResourceSchemaMapping = {};

    const projectSchema: ProjectSchema = {
      projectName: namespace.projectName,
      projectVersion: namespace.projectVersion as SemVer,
      isExtensionProject: namespace.isExtension,
      description: namespace.projectDescription,
      resourceSchemas,
    };

    const projectNamespace: ProjectNamespace = projectSchema.projectName.toLowerCase() as ProjectNamespace;

    apiSchema.projectSchemas[projectNamespace] = projectSchema;

    getEntitiesOfTypeForNamespaces([namespace], 'domainEntity').forEach((domainEntity) => {
      // Abstract entities are not resources (e.g. EducationOrganization)
      if ((domainEntity as DomainEntity).isAbstract) return;
      resourceSchemas[(domainEntity.data.edfiApiSchema as EntityApiSchemaData).endpointName] = buildResourceSchema(
        domainEntity as TopLevelEntity,
      );
    });

    getEntitiesOfTypeForNamespaces([namespace], 'association').forEach((association) => {
      // This is a workaround for the fact that the ODS/API required GeneralStudentProgramAssociation to
      // be abstract although there is no MetaEd language annotation to make an Association abstract.
      if (association.metaEdName !== 'GeneralStudentProgramAssociation') return;
      resourceSchemas[(association.data.edfiApiSchema as EntityApiSchemaData).endpointName] = buildResourceSchema(
        association as TopLevelEntity,
      );
    });

    getEntitiesOfTypeForNamespaces([namespace], 'descriptor').forEach((entity) => {
      resourceSchemas[(entity.data.edfiApiSchema as EntityApiSchemaData).endpointName] = buildResourceSchema(
        entity as TopLevelEntity,
      );
    });

    getEntitiesOfTypeForNamespaces([namespace], 'domainEntitySubclass').forEach((entity) => {
      resourceSchemas[(entity.data.edfiApiSchema as EntityApiSchemaData).endpointName] =
        buildDomainEntitySubclassResourceSchema(entity as TopLevelEntity);
    });

    getEntitiesOfTypeForNamespaces([namespace], 'associationSubclass').forEach((entity) => {
      resourceSchemas[(entity.data.edfiApiSchema as EntityApiSchemaData).endpointName] =
        buildAssociationSubclassResourceSchema(entity as TopLevelEntity);
    });
  });
  return {
    enhancerName: 'ApiSchemaBuildingEnhancer',
    success: true,
  };
}
