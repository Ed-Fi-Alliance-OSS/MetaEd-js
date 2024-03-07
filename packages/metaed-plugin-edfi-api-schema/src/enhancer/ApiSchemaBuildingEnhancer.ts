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
  MetaEdPropertyFullName,
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
import { MetaEdResourceName } from '../model/api-schema/MetaEdResourceName';
import { DocumentPaths, ScalarPath } from '../model/api-schema/DocumentPaths';

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

function hardCodeSchoolYearResourceSchema(): ResourceSchema {
  const schoolYearTypeResourceName = 'schoolYearTypes' as MetaEdResourceName;
  const documentPathsMapping: { [key: DocumentObjectKey]: DocumentPaths } = {};

  documentPathsMapping['SchoolYear' as DocumentObjectKey] = {
    isReference: false,
    pathOrder: ['schoolYear' as DocumentObjectKey],
    paths: {
      schoolYear: '$.schoolYear',
    },
  } as ScalarPath;

  documentPathsMapping['CurrentSchoolYear' as DocumentObjectKey] = {
    isReference: false,
    pathOrder: ['currentSchoolYear' as DocumentObjectKey],
    paths: {
      schoolYear: '$.currentSchoolYear',
    },
  } as ScalarPath;

  documentPathsMapping['SchoolYearDescription' as DocumentObjectKey] = {
    isReference: false,
    pathOrder: ['schoolYearDescription' as DocumentObjectKey],
    paths: {
      schoolYear: '$.schoolYearDescription',
    },
  } as ScalarPath;

  const schoolYearResourceSchema = {
    resourceName: schoolYearTypeResourceName,
    isDescriptor: false,
    isSchoolYearEnumeration: true,
    allowIdentityUpdates: false,
    jsonSchemaForInsert: {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      additionalProperties: false,
      description: 'Identifier for a school year.',
      properties: {
        schoolYear: {
          description: 'Key for School Year',
          minimum: 0,
          type: 'integer',
        },
        currentSchoolYear: {
          description: 'The code for the current school year.',
          type: 'boolean',
        },
        schoolYearDescription: {
          description: 'The description for the SchoolYear type.',
          maxLength: 50,
          type: 'string',
        },
      },
      required: ['schoolYear', 'currentSchoolYear', 'schoolYearDescription'],
      title: 'Ed-Fi.SchoolYear',
      type: 'object',
    },
    equalityConstraints: [],
    identityFullnames: ['SchoolYear' as MetaEdPropertyFullName],
    referenceJsonPathsMapping: {},
    identityPathOrder: [
      'schoolYear' as DocumentObjectKey,
      'currentSchoolYear' as DocumentObjectKey,
      'schoolYearDescription' as DocumentObjectKey,
    ],
    isSubclass: false,
    documentPathsMapping: {},
  } as ResourceSchema;

  schoolYearResourceSchema.documentPathsMapping = documentPathsMapping;

  return schoolYearResourceSchema;
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

    const schoolYearTypeEndpointName = 'SchoolYearType';
    const schoolYearTypeResourceName = 'schoolYearTypes';
    resourceNameMapping[schoolYearTypeEndpointName] = schoolYearTypeResourceName;
    caseInsensitiveEndpointNameMapping[schoolYearTypeEndpointName.toLowerCase()] = 'schoolYearTypes';
    resourceSchemas[schoolYearTypeResourceName] = hardCodeSchoolYearResourceSchema();
  });
  return {
    enhancerName: 'ApiSchemaBuildingEnhancer',
    success: true,
  };
}
