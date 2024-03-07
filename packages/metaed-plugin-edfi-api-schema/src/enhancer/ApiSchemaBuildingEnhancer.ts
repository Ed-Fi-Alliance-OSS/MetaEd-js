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
  MetaEdProjectName,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { PluginEnvironmentEdfiApiSchema } from '../model/PluginEnvironment';
import { ProjectSchema } from '../model/api-schema/ProjectSchema';
import { SemVer } from '../model/api-schema/SemVer';
import { ResourceSchema } from '../model/api-schema/ResourceSchema';
import { ResourceSchemaMapping } from '../model/api-schema/ResourceSchemaMapping';
import { ProjectNamespace } from '../model/api-schema/ProjectNamespace';
import { ResourceNameMapping } from '../model/api-schema/ResourceNameMapping';
import { DocumentObjectKey } from '../model/api-schema/DocumentObjectKey';
import { uncapitalize } from '../Utility';
import { AbstractResourceMapping } from '../model/api-schema/AbstractResourceMapping';
import { CaseInsensitiveEndpointNameMapping } from '../model/api-schema/CaseInsensitiveEndpointNameMapping';
import { buildSchoolYearResourceSchema } from './SchoolYearHardCodedSchemaBuilder';

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
    equalityConstraints: entityApiSchemaData.equalityConstraints,
    identityFullnames: entityApiSchemaData.identityFullnames,
    documentPathsMapping: entityApiSchemaData.documentPathsMapping,
    referenceJsonPathsMapping: entityApiSchemaData.referenceJsonPathsMapping,
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
    superclassIdentityDocumentKey: uncapitalize(subclassIdentityRenameProperty.baseKeyName) as DocumentObjectKey,
    subclassIdentityDocumentKey: uncapitalize(subclassIdentityRenameProperty.fullPropertyName) as DocumentObjectKey,
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
    const resourceNameMapping: ResourceNameMapping = {};
    const caseInsensitiveEndpointNameMapping: CaseInsensitiveEndpointNameMapping = {};
    const abstractResources: AbstractResourceMapping = {};

    const projectSchema: ProjectSchema = {
      projectName: namespace.projectName as MetaEdProjectName,
      projectVersion: namespace.projectVersion as SemVer,
      isExtensionProject: namespace.isExtension,
      description: namespace.projectDescription,
      resourceSchemas,
      resourceNameMapping,
      caseInsensitiveEndpointNameMapping,
      abstractResources,
    };

    const projectNamespace: ProjectNamespace = projectSchema.projectName.toLowerCase() as ProjectNamespace;
    apiSchema.projectSchemas[projectNamespace] = projectSchema;
    apiSchema.projectNameMapping[projectSchema.projectName] = projectNamespace;

    getEntitiesOfTypeForNamespaces([namespace], 'domainEntity').forEach((domainEntity) => {
      // Abstract entities are not resources (e.g. EducationOrganization)
      if ((domainEntity as DomainEntity).isAbstract) {
        abstractResources[domainEntity.metaEdName] = {
          identityPathOrder: (domainEntity.data.edfiApiSchema as EntityApiSchemaData).identityPathOrder,
        };
        return;
      }
      const { endpointName } = domainEntity.data.edfiApiSchema as EntityApiSchemaData;
      resourceNameMapping[domainEntity.metaEdName] = endpointName;
      caseInsensitiveEndpointNameMapping[endpointName.toLowerCase()] = endpointName;
      resourceSchemas[endpointName] = buildResourceSchema(domainEntity as TopLevelEntity);
    });

    getEntitiesOfTypeForNamespaces([namespace], 'association').forEach((association) => {
      // This is a workaround for the fact that the ODS/API required GeneralStudentProgramAssociation to
      // be abstract although there is no MetaEd language annotation to make an Association abstract.
      if (association.metaEdName === 'GeneralStudentProgramAssociation') {
        abstractResources[association.metaEdName] = {
          identityPathOrder: (association.data.edfiApiSchema as EntityApiSchemaData).identityPathOrder,
        };
        return;
      }
      const { endpointName } = association.data.edfiApiSchema as EntityApiSchemaData;
      resourceNameMapping[association.metaEdName] = endpointName;
      caseInsensitiveEndpointNameMapping[endpointName.toLowerCase()] = endpointName;
      resourceSchemas[endpointName] = buildResourceSchema(association as TopLevelEntity);
    });

    getEntitiesOfTypeForNamespaces([namespace], 'descriptor').forEach((entity) => {
      const { endpointName } = entity.data.edfiApiSchema as EntityApiSchemaData;
      resourceNameMapping[entity.metaEdName] = endpointName;
      caseInsensitiveEndpointNameMapping[endpointName.toLowerCase()] = endpointName;
      resourceSchemas[endpointName] = buildResourceSchema(entity as TopLevelEntity);
    });

    getEntitiesOfTypeForNamespaces([namespace], 'domainEntitySubclass').forEach((entity) => {
      const { endpointName } = entity.data.edfiApiSchema as EntityApiSchemaData;
      resourceNameMapping[entity.metaEdName] = endpointName;
      caseInsensitiveEndpointNameMapping[endpointName.toLowerCase()] = endpointName;
      resourceSchemas[endpointName] = buildDomainEntitySubclassResourceSchema(entity as TopLevelEntity);
    });

    getEntitiesOfTypeForNamespaces([namespace], 'associationSubclass').forEach((entity) => {
      const { endpointName } = entity.data.edfiApiSchema as EntityApiSchemaData;
      resourceNameMapping[entity.metaEdName] = endpointName;
      caseInsensitiveEndpointNameMapping[endpointName.toLowerCase()] = endpointName;
      resourceSchemas[endpointName] = buildAssociationSubclassResourceSchema(entity as TopLevelEntity);
    });

    buildSchoolYearResourceSchema(resourceNameMapping, caseInsensitiveEndpointNameMapping, resourceSchemas);
  });
  return {
    enhancerName: 'ApiSchemaBuildingEnhancer',
    success: true,
  };
}
