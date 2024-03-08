import { MetaEdPropertyFullName } from '@edfi/metaed-core';
import { ResourceSchema } from '../model/api-schema/ResourceSchema';
import { DocumentObjectKey } from '../model/api-schema/DocumentObjectKey';
import { MetaEdResourceName } from '../model/api-schema/MetaEdResourceName';
import { DocumentPaths, ScalarPath } from '../model/api-schema/DocumentPaths';
import { ResourceNameMapping } from '../model/api-schema/ResourceNameMapping';
import { CaseInsensitiveEndpointNameMapping } from '../model/api-schema/CaseInsensitiveEndpointNameMapping';
import { ResourceSchemaMapping } from '../model/api-schema/ResourceSchemaMapping';
import { capitalize } from '../Utility';
import { JsonPath } from '../model/api-schema/JsonPath';

function buildDocumentPathsMapping(documentObjectPathsLowerCamel: string[]): { [key: DocumentObjectKey]: DocumentPaths } {
  const documentPathsMapping: { [key: DocumentObjectKey]: DocumentPaths } = {};

  documentObjectPathsLowerCamel.forEach((lowerCamel) => {
    documentPathsMapping[capitalize(lowerCamel) as DocumentObjectKey] = {
      isReference: false,
      pathOrder: [lowerCamel as DocumentObjectKey],
      paths: {},
    } as ScalarPath;

    documentPathsMapping[capitalize(lowerCamel) as DocumentObjectKey].paths[lowerCamel as DocumentObjectKey] =
      `$.${lowerCamel}` as JsonPath;
  });

  return documentPathsMapping;
}

export function buildSchoolYearResourceSchema(
  resourceNameMapping: ResourceNameMapping,
  caseInsensitiveEndpointNameMapping: CaseInsensitiveEndpointNameMapping,
  resourceSchemaMapping: ResourceSchemaMapping,
) {
  const nameCamelSingular = 'SchoolYearType';
  const nameCamelPlural = 'SchoolYearTypes';
  const nameLowerCamelPlural = 'schoolYearTypes';
  const documentObjectPathsLowerCamel = ['schoolYear', 'currentSchoolYear', 'schoolYearDescription'];

  resourceNameMapping[nameCamelSingular] = nameLowerCamelPlural;
  caseInsensitiveEndpointNameMapping[nameLowerCamelPlural.toLowerCase()] = nameLowerCamelPlural;

  const schoolYearResourceSchema = {
    resourceName: nameCamelPlural as MetaEdResourceName,
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
      required: documentObjectPathsLowerCamel,
      title: 'Ed-Fi.SchoolYear',
      type: 'object',
    },
    equalityConstraints: [],
    identityFullnames: ['SchoolYear'] as MetaEdPropertyFullName[],
    referenceJsonPathsMapping: {},
    identityPathOrder: ['schoolYear'] as DocumentObjectKey[],
    isSubclass: false,
    documentPathsMapping: buildDocumentPathsMapping(documentObjectPathsLowerCamel),
  } as ResourceSchema;

  resourceSchemaMapping[nameLowerCamelPlural] = schoolYearResourceSchema;
}
