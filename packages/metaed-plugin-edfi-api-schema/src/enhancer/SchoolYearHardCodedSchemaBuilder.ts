// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ResourceSchema } from '../model/api-schema/ResourceSchema';
import { DocumentObjectKey } from '../model/api-schema/DocumentObjectKey';
import { MetaEdResourceName } from '../model/api-schema/MetaEdResourceName';
import { DocumentPaths, ScalarPath } from '../model/api-schema/DocumentPaths';
import { ResourceNameMapping } from '../model/api-schema/ResourceNameMapping';
import { CaseInsensitiveEndpointNameMapping } from '../model/api-schema/CaseInsensitiveEndpointNameMapping';
import { ResourceSchemaMapping } from '../model/api-schema/ResourceSchemaMapping';
import { capitalize } from '../Utility';
import { JsonPath } from '../model/api-schema/JsonPath';
import { EndpointName } from '../model/api-schema/EndpointName';
import { QueryFieldMapping } from '../model/api-schema/QueryFieldMapping';

function buildDocumentPathsMapping(documentObjectPaths: string[]): { [key: DocumentObjectKey]: DocumentPaths } {
  const documentPathsMapping: { [key: DocumentObjectKey]: DocumentPaths } = {};

  documentObjectPaths.forEach((documentObjectPath) => {
    documentPathsMapping[capitalize(documentObjectPath) as DocumentObjectKey] = {
      isReference: false,
      path: `$.${documentObjectPath}` as JsonPath,
    } as ScalarPath;
  });

  return documentPathsMapping;
}

function buildQueryFieldMapping(documentObjectPaths: string[]): QueryFieldMapping {
  const result: QueryFieldMapping = {};

  documentObjectPaths.forEach((documentObjectPath) => {
    result[documentObjectPath] = [{ path: `$.${documentObjectPath}` as JsonPath, type: 'string' }];
  });

  return result;
}

export function buildSchoolYearResourceSchema(
  resourceNameMapping: ResourceNameMapping,
  caseInsensitiveEndpointNameMapping: CaseInsensitiveEndpointNameMapping,
  resourceSchemaMapping: ResourceSchemaMapping,
) {
  const metaEdResourceName: MetaEdResourceName = 'SchoolYearType' as MetaEdResourceName;
  const endpointName: EndpointName = 'schoolYearTypes' as EndpointName;
  const lowerCasedEndpointName: EndpointName = 'schoolyeartypes' as EndpointName;
  const documentObjectPaths = ['schoolYear', 'currentSchoolYear', 'schoolYearDescription'];

  resourceNameMapping[metaEdResourceName] = endpointName;
  caseInsensitiveEndpointNameMapping[lowerCasedEndpointName] = endpointName;

  resourceSchemaMapping[endpointName] = {
    resourceName: 'SchoolYearType' as MetaEdResourceName,
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
      required: documentObjectPaths,
      title: 'Ed-Fi.SchoolYear',
      type: 'object',
    },
    equalityConstraints: [],
    identityJsonPaths: ['$.schoolYear'] as JsonPath[],
    booleanJsonPaths: ['$.currentSchoolYear'] as JsonPath[],
    numericJsonPaths: ['$.schoolYear'] as JsonPath[],
    dateTimeJsonPaths: [] as JsonPath[],
    isSubclass: false,
    isResourceExtension: false,
    documentPathsMapping: buildDocumentPathsMapping(documentObjectPaths),
    queryFieldMapping: buildQueryFieldMapping(documentObjectPaths),
    securityElements: { Namespace: [], EducationOrganization: [], Student: [] },
    authorizationSecurable: { Student: [] },
    authorizationPathways: [],
  } as ResourceSchema;
}
