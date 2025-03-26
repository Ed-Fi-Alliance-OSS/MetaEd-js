// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { invariant } from 'ts-invariant';
import {
  MetaEdEnvironment,
  EnhancerResult,
  getEntitiesOfTypeForNamespaces,
  Namespace,
  DomainEntity,
  TopLevelEntity,
  EntityProperty,
  DomainEntitySubclass,
  AssociationSubclass,
  MetaEdProjectName,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { BaseProjectSchema, ProjectSchema } from '../model/api-schema/ProjectSchema';
import { SemVer } from '../model/api-schema/SemVer';
import { ResourceSchema, NonExtensionResourceSchema, ResourceExtensionSchema } from '../model/api-schema/ResourceSchema';
import { ResourceSchemaMapping } from '../model/api-schema/ResourceSchemaMapping';
import { ResourceNameMapping } from '../model/api-schema/ResourceNameMapping';
import { uncapitalize } from '../Utility';
import { AbstractResourceMapping } from '../model/api-schema/AbstractResourceMapping';
import { CaseInsensitiveEndpointNameMapping } from '../model/api-schema/CaseInsensitiveEndpointNameMapping';
import { buildSchoolYearResourceSchema } from './SchoolYearHardCodedSchemaBuilder';
import { JsonPath } from '../model/api-schema/JsonPath';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import { DocumentPathsMapping } from '../model/api-schema/DocumentPathsMapping';
import { DocumentPaths } from '../model/api-schema/DocumentPaths';
import { QueryFieldMapping } from '../model/api-schema/QueryFieldMapping';
import { QueryFieldPathInfo } from '../model/api-schema/QueryFieldPathInfo';
import { ProjectEndpointName } from '../model/api-schema/ProjectEndpointName';
import { EducationOrganizationHierarchy } from '../model/EducationOrganizationHierarchy';
import { MetaEdResourceName } from '../model/api-schema/MetaEdResourceName';

/**
 * Removes the sourceProperty attributes from DocumentPathsMapping, which are not needed for stringification
 * and in fact prevent it due to circular references.
 */
export function removeSourcePropertyFromDocumentPathsMapping(
  documentPathsMapping: DocumentPathsMapping,
): DocumentPathsMapping {
  const result: DocumentPathsMapping = {};
  Object.entries(documentPathsMapping).forEach(([propertyFullName, documentPaths]) => {
    const updatedDocumentPaths: DocumentPaths = { ...documentPaths };
    delete updatedDocumentPaths.sourceProperty;
    result[propertyFullName] = updatedDocumentPaths;
  });
  return result;
}

/**
 * Removes the sourceProperty attributes from QueryFieldMapping, which are not needed for stringification
 * and in fact prevent it due to circular references.
 */
export function removeSourcePropertyFromQueryFieldMapping(queryFieldMapping: QueryFieldMapping): QueryFieldMapping {
  const result: QueryFieldMapping = {};
  Object.entries(queryFieldMapping).forEach(([queryField, queryFieldPathInfoArray]) => {
    const updateQueryFieldPathInfoArray: QueryFieldPathInfo[] = queryFieldPathInfoArray.map((queryFieldPathInfo) => {
      const updatedQueryFieldPathInfo: QueryFieldPathInfo = { ...queryFieldPathInfo };
      delete updatedQueryFieldPathInfo.sourceProperty;
      return updatedQueryFieldPathInfo;
    });
    result[queryField] = updateQueryFieldPathInfoArray;
  });
  return result;
}

/**
 *
 */
function buildResourceSchema(entity: TopLevelEntity): NonExtensionResourceSchema {
  const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  return {
    resourceName: entityApiSchemaData.resourceName,
    isDescriptor: entity.type === 'descriptor',
    isSchoolYearEnumeration: entity.type === 'schoolYearEnumeration',
    allowIdentityUpdates: entity.allowPrimaryKeyUpdates,
    jsonSchemaForInsert: entityApiSchemaData.jsonSchemaForInsert,
    equalityConstraints: entityApiSchemaData.equalityConstraints,
    documentPathsMapping: removeSourcePropertyFromDocumentPathsMapping(entityApiSchemaData.documentPathsMapping),
    queryFieldMapping: removeSourcePropertyFromQueryFieldMapping(entityApiSchemaData.queryFieldMapping),
    identityJsonPaths: entityApiSchemaData.identityJsonPaths,
    booleanJsonPaths: entityApiSchemaData.booleanJsonPaths,
    numericJsonPaths: entityApiSchemaData.numericJsonPaths,
    dateTimeJsonPaths: entityApiSchemaData.dateTimeJsonPaths,
    securityElements: {
      Namespace: entityApiSchemaData.namespaceSecurityElements,
      EducationOrganization: entityApiSchemaData.educationOrganizationSecurityElements,
    },
    authorizationSecurable: {
      Student: entityApiSchemaData.studentSecurableAuthorizationElements,
    },
    isResourceExtension: false,
  };
}

/**
 *
 */
function buildResourceExtensionSchema(entity: TopLevelEntity): ResourceExtensionSchema {
  const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  return {
    resourceName: entityApiSchemaData.resourceName,
    jsonSchemaForInsert: entityApiSchemaData.jsonSchemaForInsert,
    equalityConstraints: entityApiSchemaData.equalityConstraints,
    documentPathsMapping: removeSourcePropertyFromDocumentPathsMapping(entityApiSchemaData.documentPathsMapping),
    booleanJsonPaths: entityApiSchemaData.booleanJsonPaths,
    numericJsonPaths: entityApiSchemaData.numericJsonPaths,
    dateTimeJsonPaths: entityApiSchemaData.dateTimeJsonPaths,
    securityElements: {
      Namespace: [],
      EducationOrganization: [],
    },
    authorizationSecurable: {
      Student: [],
    },
    isResourceExtension: true,
  };
}

/**
 * Includes DomainEntity superclass information in the ResourceSchema
 */
function buildDomainEntitySubclassResourceSchema(entity: DomainEntitySubclass): ResourceSchema {
  const baseResourceSchema: NonExtensionResourceSchema = buildResourceSchema(entity);

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
    superclassIdentityJsonPath: `$.${uncapitalize(subclassIdentityRenameProperty.baseKeyName)}` as JsonPath,
    isSubclass: true,
    subclassType: 'domainEntity',
  };
}

/**
 * Includes Association superclass information in the ResourceSchema
 */
function buildAssociationSubclassResourceSchema(entity: AssociationSubclass): ResourceSchema {
  const baseResourceSchema: NonExtensionResourceSchema = buildResourceSchema(entity);

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
  metaEd.namespace.forEach((namespace: Namespace) => {
    const resourceSchemas: ResourceSchemaMapping = {};
    const resourceNameMapping: ResourceNameMapping = {};
    const caseInsensitiveEndpointNameMapping: CaseInsensitiveEndpointNameMapping = {};
    const abstractResources: AbstractResourceMapping = {};

    const baseProjectSchema: BaseProjectSchema = {
      projectName: namespace.projectName as MetaEdProjectName,
      projectVersion: namespace.projectVersion as SemVer,
      projectEndpointName: namespace.projectName.toLowerCase() as ProjectEndpointName,
      description: namespace.projectDescription,
      resourceSchemas,
      resourceNameMapping,
      caseInsensitiveEndpointNameMapping,
      abstractResources,
      compatibleDsRange: null,
      educationOrganizationTypes: namespace.data.educationOrganizationTypes as MetaEdResourceName[],
      educationOrganizationHierarchy: namespace.data.educationOrganizationHierarchy as EducationOrganizationHierarchy,
    };

    let projectSchema: ProjectSchema;

    if (namespace.isExtension) {
      projectSchema = {
        ...baseProjectSchema,
        isExtensionProject: true,
        compatibleDsRange: metaEd.dataStandardVersion as SemVer,
        openApiExtensionResourceFragments: namespace.data.edfiApiSchema.openApiExtensionResourceFragments,
        openApiExtensionDescriptorFragments: namespace.data.edfiApiSchema.openApiExtensionDescriptorFragments,
      };
    } else {
      projectSchema = {
        ...baseProjectSchema,
        isExtensionProject: false,
        openApiCoreResources: namespace.data.edfiApiSchema.openApiCoreResources,
        openApiCoreDescriptors: namespace.data.edfiApiSchema.openApiCoreDescriptors,
      };
    }

    const { apiSchema } = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
    apiSchema.projectSchema = projectSchema;

    getEntitiesOfTypeForNamespaces([namespace], 'domainEntity').forEach((domainEntity) => {
      // Abstract entities are not resources (e.g. EducationOrganization)
      if ((domainEntity as DomainEntity).isAbstract) {
        abstractResources[domainEntity.metaEdName] = {
          identityJsonPaths: (domainEntity.data.edfiApiSchema as EntityApiSchemaData).identityJsonPaths,
        };
        return;
      }
      const { endpointName, resourceName } = domainEntity.data.edfiApiSchema as EntityApiSchemaData;
      resourceNameMapping[resourceName] = endpointName;
      caseInsensitiveEndpointNameMapping[endpointName.toLowerCase()] = endpointName;
      resourceSchemas[endpointName] = { ...buildResourceSchema(domainEntity as TopLevelEntity), isSubclass: false };
    });

    getEntitiesOfTypeForNamespaces([namespace], 'association').forEach((association) => {
      // This is a workaround for the fact that the ODS/API required GeneralStudentProgramAssociation to
      // be abstract although there is no MetaEd language annotation to make an Association abstract.
      if (association.metaEdName === 'GeneralStudentProgramAssociation') {
        abstractResources[association.metaEdName] = {
          identityJsonPaths: (association.data.edfiApiSchema as EntityApiSchemaData).identityJsonPaths,
        };
        return;
      }
      const { endpointName, resourceName } = association.data.edfiApiSchema as EntityApiSchemaData;
      resourceNameMapping[resourceName] = endpointName;
      caseInsensitiveEndpointNameMapping[endpointName.toLowerCase()] = endpointName;
      resourceSchemas[endpointName] = { ...buildResourceSchema(association as TopLevelEntity), isSubclass: false };
    });

    getEntitiesOfTypeForNamespaces([namespace], 'descriptor').forEach((entity) => {
      const { endpointName, resourceName } = entity.data.edfiApiSchema as EntityApiSchemaData;
      resourceNameMapping[resourceName] = endpointName;
      caseInsensitiveEndpointNameMapping[endpointName.toLowerCase()] = endpointName;
      resourceSchemas[endpointName] = { ...buildResourceSchema(entity as TopLevelEntity), isSubclass: false };
    });

    getEntitiesOfTypeForNamespaces([namespace], 'domainEntitySubclass').forEach((entity) => {
      const { endpointName, resourceName } = entity.data.edfiApiSchema as EntityApiSchemaData;
      resourceNameMapping[resourceName] = endpointName;
      caseInsensitiveEndpointNameMapping[endpointName.toLowerCase()] = endpointName;
      resourceSchemas[endpointName] = buildDomainEntitySubclassResourceSchema(entity as TopLevelEntity);
    });

    getEntitiesOfTypeForNamespaces([namespace], 'associationSubclass').forEach((entity) => {
      const { endpointName, resourceName } = entity.data.edfiApiSchema as EntityApiSchemaData;
      resourceNameMapping[resourceName] = endpointName;
      caseInsensitiveEndpointNameMapping[endpointName.toLowerCase()] = endpointName;
      resourceSchemas[endpointName] = buildAssociationSubclassResourceSchema(entity as TopLevelEntity);
    });

    getEntitiesOfTypeForNamespaces([namespace], 'domainEntityExtension', 'associationExtension').forEach((entity) => {
      const { endpointName } = entity.data.edfiApiSchema as EntityApiSchemaData;
      resourceSchemas[endpointName] = buildResourceExtensionSchema(entity as TopLevelEntity);
    });

    if (!projectSchema.isExtensionProject) {
      buildSchoolYearResourceSchema(resourceNameMapping, caseInsensitiveEndpointNameMapping, resourceSchemas);
    }
  });
  return {
    enhancerName: 'ApiSchemaBuildingEnhancer',
    success: true,
  };
}
