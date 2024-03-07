import { MetaEdPropertyFullName } from '@edfi/metaed-core';
import { ResourceSchema } from '../model/api-schema/ResourceSchema';
import { DocumentObjectKey } from '../model/api-schema/DocumentObjectKey';
import { MetaEdResourceName } from '../model/api-schema/MetaEdResourceName';
import { DocumentPaths, ScalarPath } from '../model/api-schema/DocumentPaths';
import { ResourceNameMapping } from '../model/api-schema/ResourceNameMapping';
import { CaseInsensitiveEndpointNameMapping } from '../model/api-schema/CaseInsensitiveEndpointNameMapping';
import { ResourceSchemaMapping } from '../model/api-schema/ResourceSchemaMapping';

function buildDocumentPathsMapping(): { [key: DocumentObjectKey]: DocumentPaths } {
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

  return documentPathsMapping;
}

export function buildSchoolYearResourceSchema(
  resourceNameMapping: ResourceNameMapping,
  caseInsensitiveEndpointNameMapping: CaseInsensitiveEndpointNameMapping,
  resourceSchemaMapping: ResourceSchemaMapping,
) {
  const schoolYearTypeResourceName = 'schoolYearTypes' as MetaEdResourceName;
  const schoolYearTypeEndpointName = 'SchoolYearType';

  resourceNameMapping[schoolYearTypeEndpointName] = schoolYearTypeResourceName;
  caseInsensitiveEndpointNameMapping[schoolYearTypeEndpointName.toLowerCase()] = 'schoolYearTypes';

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
    identityFullnames: ['SchoolYear'] as MetaEdPropertyFullName[],
    referenceJsonPathsMapping: {},
    identityPathOrder: ['schoolYear'] as DocumentObjectKey[],
    isSubclass: false,
    documentPathsMapping: buildDocumentPathsMapping(),
  } as ResourceSchema;

  resourceSchemaMapping[schoolYearTypeResourceName] = schoolYearResourceSchema;
}
