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
  SchoolYearEnumeration,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { ProjectSchema } from '../model/api-schema/ProjectSchema';
import { SemVer } from '../model/api-schema/SemVer';
import { ResourceSchema, NonExtensionResourceSchema, ResourceExtensionSchema } from '../model/api-schema/ResourceSchema';
import { ResourceSchemaMapping } from '../model/api-schema/ResourceSchemaMapping';
import { ResourceNameMapping } from '../model/api-schema/ResourceNameMapping';
import { createUriSegment, uncapitalize } from '../Utility';
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
import { OpenApiDocumentType } from '../model/api-schema/OpenApiDocumentType';

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
 * Builds a complete ResourceSchema from the pieces iteratively added to entityApiSchemaData
 * by previous enhancers.
 */
function buildResourceSchema(entity: TopLevelEntity): NonExtensionResourceSchema {
  const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  return {
    resourceName: entityApiSchemaData.resourceName,
    domains: entityApiSchemaData.domains,
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
    dateJsonPaths: entityApiSchemaData.dateJsonPaths,
    dateTimeJsonPaths: entityApiSchemaData.dateTimeJsonPaths,
    decimalPropertyValidationInfos: entityApiSchemaData.decimalPropertyValidationInfos,
    securableElements: {
      Namespace: entityApiSchemaData.namespaceSecurableElements,
      EducationOrganization: entityApiSchemaData.educationOrganizationSecurableElements,
      Student: entityApiSchemaData.studentSecurableElements,
      Contact: entityApiSchemaData.contactSecurableElements,
      Staff: entityApiSchemaData.staffSecurableElements,
    },
    authorizationPathways: entityApiSchemaData.authorizationPathways,
    arrayUniquenessConstraints: entityApiSchemaData.arrayUniquenessConstraints,
    isResourceExtension: false,
    openApiFragments: entityApiSchemaData.openApiFragments,
    flatteningMetadata: entityApiSchemaData.flatteningMetadata,
  };
}

/**
 * Builds a complete ResourceExtensionSchema from the pieces iteratively added to entityApiSchemaData
 * by previous enhancers.
 */
function buildResourceExtensionSchema(entity: TopLevelEntity): ResourceExtensionSchema {
  const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  return {
    resourceName: entityApiSchemaData.resourceName,
    domains: entityApiSchemaData.domains,
    jsonSchemaForInsert: entityApiSchemaData.jsonSchemaForInsert,
    equalityConstraints: entityApiSchemaData.equalityConstraints,
    documentPathsMapping: removeSourcePropertyFromDocumentPathsMapping(entityApiSchemaData.documentPathsMapping),
    booleanJsonPaths: entityApiSchemaData.booleanJsonPaths,
    numericJsonPaths: entityApiSchemaData.numericJsonPaths,
    dateJsonPaths: entityApiSchemaData.dateJsonPaths,
    dateTimeJsonPaths: entityApiSchemaData.dateTimeJsonPaths,
    decimalPropertyValidationInfos: entityApiSchemaData.decimalPropertyValidationInfos,
    securableElements: {
      Namespace: [],
      EducationOrganization: [],
      Student: [],
      Contact: [],
      Staff: [],
    },
    authorizationPathways: [],
    arrayUniquenessConstraints: entityApiSchemaData.arrayUniquenessConstraints,
    isResourceExtension: true,
    openApiFragments: entityApiSchemaData.openApiFragments,
    // Additional properties specific to resource extensions
    allowIdentityUpdates: entity.allowPrimaryKeyUpdates,
    identityJsonPaths: entityApiSchemaData.identityJsonPaths ?? [],
    isDescriptor: entity.type === 'descriptor',
    isSchoolYearEnumeration: entity.type === 'schoolYearEnumeration',
    flatteningMetadata: entityApiSchemaData.flatteningMetadata,
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

    const projectSchema: ProjectSchema = {
      projectName: namespace.projectName as MetaEdProjectName,
      projectVersion: namespace.projectVersion as SemVer,
      projectEndpointName: createUriSegment(namespace.projectName) as ProjectEndpointName,
      description: namespace.projectDescription,
      resourceSchemas,
      resourceNameMapping,
      caseInsensitiveEndpointNameMapping,
      abstractResources,
      compatibleDsRange: namespace.isExtension ? (metaEd.dataStandardVersion as SemVer) : null,
      isExtensionProject: namespace.isExtension,
      educationOrganizationTypes: namespace.data.educationOrganizationTypes as MetaEdResourceName[],
      educationOrganizationHierarchy: namespace.data.educationOrganizationHierarchy as EducationOrganizationHierarchy,
      domains: (namespace.data.edfiApiSchema as NamespaceEdfiApiSchema).domains,
      openApiBaseDocuments: (namespace.data.edfiApiSchema as NamespaceEdfiApiSchema).openApiBaseDocuments,
    };

    const { apiSchema } = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
    apiSchema.projectSchema = projectSchema;

    getEntitiesOfTypeForNamespaces([namespace], 'domainEntity').forEach((domainEntity) => {
      // Abstract entities are not resources (e.g. EducationOrganization)
      if ((domainEntity as DomainEntity).isAbstract) {
        const entityApiSchemaData = domainEntity.data.edfiApiSchema as EntityApiSchemaData;
        abstractResources[domainEntity.metaEdName] = {
          identityJsonPaths: entityApiSchemaData.identityJsonPaths,
          openApiFragment: entityApiSchemaData.openApiFragments?.[OpenApiDocumentType.RESOURCES],
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
        const entityApiSchemaData = association.data.edfiApiSchema as EntityApiSchemaData;
        abstractResources[association.metaEdName] = {
          identityJsonPaths: entityApiSchemaData.identityJsonPaths,
          openApiFragment: entityApiSchemaData.openApiFragments?.[OpenApiDocumentType.RESOURCES],
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
      resourceSchemas[endpointName] = { ...buildResourceExtensionSchema(entity as TopLevelEntity), isSubclass: false };
    });

    if (!projectSchema.isExtensionProject) {
      const schoolYear = namespace.entity.schoolYearEnumeration.get('SchoolYear');
      if (schoolYear != null) {
        buildSchoolYearResourceSchema(
          schoolYear as SchoolYearEnumeration,
          metaEd.minSchoolYear,
          metaEd.maxSchoolYear,
          resourceNameMapping,
          caseInsensitiveEndpointNameMapping,
          resourceSchemas,
        );
      }
    }
  });
  return {
    enhancerName: 'ApiSchemaBuildingEnhancer',
    success: true,
  };
}
