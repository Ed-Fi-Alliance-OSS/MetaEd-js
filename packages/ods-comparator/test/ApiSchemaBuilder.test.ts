// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApiSchemaBuilder } from './ApiSchemaBuilder';
import { ApiSchema } from '../src/api-schema/ApiSchema';

// A test of the ApiSchemaBuilder test utility
describe('ApiSchemaBuilder', () => {
  describe('Given a school that is a subclass with no outbound references', () => {
    let apiSchema: ApiSchema;

    beforeEach(() => {
      apiSchema = ApiSchemaBuilder.build()
        .withStartProject()
        .withStartResource('School')
        .withIdentityJsonPaths(['$.schoolId'])
        .withStartDocumentPathsMapping()
        .withDocumentPathScalar('SchoolId', '$.schoolId')
        .withEndDocumentPathsMapping()
        .withSuperclassInformation('domainEntity', '$.educationOrganizationId', 'EducationOrganization')
        .withEndResource()
        .withEndProject()
        .asSingleApiSchemaRootNode();
    });

    it('should create an ApiSchema with the correct structure', () => {
      expect(apiSchema).toMatchInlineSnapshot(`
        Object {
          "apiSchemaVersion": "1.0.0",
          "projectSchema": Object {
            "abstractResources": Object {},
            "caseInsensitiveEndpointNameMapping": Object {
              "schools": "schools",
            },
            "description": "Ed-Fi description",
            "isExtensionProject": false,
            "projectEndpointName": "ed-fi",
            "projectName": "Ed-Fi",
            "projectVersion": "5.0.0",
            "resourceNameMapping": Object {
              "School": "schools",
            },
            "resourceSchemas": Object {
              "schools": Object {
                "allowIdentityUpdates": false,
                "arrayUniquenessConstraints": Array [],
                "authorizationPathways": Array [],
                "booleanJsonPaths": Array [],
                "dateTimeJsonPaths": Array [],
                "documentPathsMapping": Object {
                  "SchoolId": Object {
                    "isReference": false,
                    "path": "$.schoolId",
                  },
                },
                "equalityConstraints": Array [],
                "identityJsonPaths": Array [
                  "$.schoolId",
                ],
                "isDescriptor": false,
                "isResourceExtension": false,
                "isSchoolYearEnumeration": false,
                "isSubclass": true,
                "jsonSchemaForInsert": Object {},
                "numericJsonPaths": Array [],
                "queryFieldMapping": Object {},
                "resourceName": "School",
                "securableElements": Object {
                  "Namespace": Array [],
                },
                "subclassType": "domainEntity",
                "superclassIdentityJsonPath": "$.educationOrganizationId",
                "superclassProjectName": "Ed-Fi",
                "superclassResourceName": "EducationOrganization",
              },
            },
          },
        }
      `);
    });
  });

  describe('Given a resource with references and descriptors', () => {
    let apiSchema: ApiSchema;

    beforeEach(() => {
      apiSchema = ApiSchemaBuilder.build()
        .withStartProject()
        .withStartResource('StudentSchoolAssociation', false, false, false, false, false)
        .withIdentityJsonPaths(['$.studentReference.studentUniqueId', '$.schoolReference.schoolId'])
        .withStartDocumentPathsMapping()
        .withDocumentPathReference('Student', [['$.studentUniqueId', '$.studentReference.studentUniqueId']])
        .withDocumentPathReference('School', [['$.schoolId', '$.schoolReference.schoolId']])
        .withDocumentPathDescriptor('EntryGradeLevelDescriptor', '$.entryGradeLevelDescriptor')
        .withDocumentPathScalar('EntryDate', '$.entryDate')
        .withEndDocumentPathsMapping()
        .withStartQueryFieldMapping()
        .withQueryField('studentUniqueId', [{ jsonPathString: '$.studentReference.studentUniqueId', type: 'string' }])
        .withQueryField('schoolId', [{ jsonPathString: '$.schoolReference.schoolId', type: 'string' }])
        .withEndQueryFieldMapping()
        .withEndResource()
        .withEndProject()
        .asSingleApiSchemaRootNode();
    });

    it('should create studentSchoolAssociations correctly', () => {
      const resource = apiSchema.projectSchema.resourceSchemas['studentSchoolAssociations' as any];
      expect(resource).toMatchInlineSnapshot(`
        Object {
          "allowIdentityUpdates": false,
          "arrayUniquenessConstraints": Array [],
          "authorizationPathways": Array [],
          "booleanJsonPaths": Array [],
          "dateTimeJsonPaths": Array [],
          "documentPathsMapping": Object {
            "EntryDate": Object {
              "isReference": false,
              "path": "$.entryDate",
            },
            "EntryGradeLevelDescriptor": Object {
              "isDescriptor": true,
              "isReference": true,
              "isRequired": false,
              "path": "$.entryGradeLevelDescriptor",
              "projectName": "Ed-Fi",
              "resourceName": "EntryGradeLevelDescriptor",
              "type": "string",
            },
            "School": Object {
              "isDescriptor": false,
              "isReference": true,
              "isRequired": false,
              "projectName": "Ed-Fi",
              "referenceJsonPaths": Array [
                Object {
                  "identityJsonPath": "$.schoolId",
                  "referenceJsonPath": "$.schoolReference.schoolId",
                },
              ],
              "resourceName": "School",
            },
            "Student": Object {
              "isDescriptor": false,
              "isReference": true,
              "isRequired": false,
              "projectName": "Ed-Fi",
              "referenceJsonPaths": Array [
                Object {
                  "identityJsonPath": "$.studentUniqueId",
                  "referenceJsonPath": "$.studentReference.studentUniqueId",
                },
              ],
              "resourceName": "Student",
            },
          },
          "equalityConstraints": Array [],
          "identityJsonPaths": Array [
            "$.studentReference.studentUniqueId",
            "$.schoolReference.schoolId",
          ],
          "isDescriptor": false,
          "isResourceExtension": false,
          "isSchoolYearEnumeration": false,
          "isSubclass": false,
          "jsonSchemaForInsert": Object {},
          "numericJsonPaths": Array [],
          "queryFieldMapping": Object {
            "schoolId": Array [
              Object {
                "path": "$.schoolReference.schoolId",
                "type": "string",
              },
            ],
            "studentUniqueId": Array [
              Object {
                "path": "$.studentReference.studentUniqueId",
                "type": "string",
              },
            ],
          },
          "resourceName": "StudentSchoolAssociation",
          "securableElements": Object {
            "Namespace": Array [],
          },
        }
      `);
    });
  });

  describe('Given multiple projects', () => {
    let apiSchemas: ApiSchema[];

    beforeEach(() => {
      const builder = ApiSchemaBuilder.build()
        // Core Ed-Fi project
        .withStartProject('Ed-Fi', '5.0.0')
        .withStartResource('School')
        .withIdentityJsonPaths(['$.schoolId'])
        .withEndResource()
        .withEndProject()
        // Extension project
        .withStartProject('TPDM', '1.1.0')
        .withStartResource('Candidate')
        .withIdentityJsonPaths(['$.candidateIdentifier'])
        .withEndResource()
        .withEndProject();

      apiSchemas = builder.toApiSchemas();
    });

    it('should create multiple ApiSchemas', () => {
      expect(apiSchemas).toHaveLength(2);
      expect(apiSchemas[0].projectSchema.projectName).toBe('Ed-Fi');
      expect(apiSchemas[0].projectSchema.isExtensionProject).toBe(false);
      expect(apiSchemas[1].projectSchema.projectName).toBe('TPDM');
      expect(apiSchemas[1].projectSchema.isExtensionProject).toBe(true);
    });
  });
});
