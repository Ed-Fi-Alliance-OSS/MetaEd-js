// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  type EntityProperty,
  type IntegerProperty,
  newEntityProperty,
  type StringProperty,
  type TopLevelEntity,
} from '@edfi/metaed-core';
import { createTrackedChangeSchemasFrom } from '../../src/enhancer/OpenApiChangeQuerySchemaBuilder';
import type { JsonPath } from '../../src/model/api-schema/JsonPath';
import type { QueryFieldMapping } from '../../src/model/api-schema/QueryFieldMapping';

/**
 * Creates a string source property for tracked-change schema tests.
 */
function stringSourceProperty(): EntityProperty {
  return {
    ...newEntityProperty(),
    type: 'string',
    documentation: 'Student Unique Id',
    minLength: '1',
    maxLength: '32',
  } as StringProperty;
}

/**
 * Creates an integer source property for tracked-change schema tests.
 */
function integerSourceProperty(): EntityProperty {
  return {
    ...newEntityProperty(),
    type: 'integer',
    documentation: 'School Id',
    hasBigHint: false,
  } as IntegerProperty;
}

/**
 * Creates a descriptor source property for tracked-change schema tests.
 */
function descriptorSourceProperty(): EntityProperty {
  return {
    ...newEntityProperty(),
    type: 'descriptor',
    documentation: 'Entry grade level descriptor',
  };
}

/**
 * Creates regular resource query field mapping metadata for tracked-change schema tests.
 */
function regularResourceQueryFieldMapping(): QueryFieldMapping {
  return {
    entryGradeLevelDescriptor: [
      {
        path: '$.entryGradeLevelDescriptor' as JsonPath,
        type: 'string',
        sourceProperty: descriptorSourceProperty(),
      },
    ],
    internalEntryGradeLevelDescriptorId: [
      {
        path: '$.entryGradeLevelDescriptorId' as JsonPath,
        type: 'number',
        sourceProperty: integerSourceProperty(),
      },
    ],
    schoolId: [
      {
        path: '$.schoolReference.schoolId' as JsonPath,
        type: 'number',
        sourceProperty: integerSourceProperty(),
      },
    ],
    studentUniqueId: [
      {
        path: '$.studentReference.studentUniqueId' as JsonPath,
        type: 'string',
        sourceProperty: stringSourceProperty(),
      },
    ],
  };
}

/**
 * Creates a top-level entity with only the data needed by tracked-change schema generation.
 */
function topLevelEntityWith(
  type: string,
  metaEdName: string,
  isAbstract: boolean,
  queryFieldMapping: QueryFieldMapping,
): TopLevelEntity {
  return {
    type,
    metaEdName,
    isAbstract,
    namespace: {
      namespaceName: 'EdFi',
    },
    data: {
      edfiApiSchema: {
        identityJsonPaths: [
          '$.entryGradeLevelDescriptor' as JsonPath,
          '$.schoolReference.schoolId' as JsonPath,
          '$.studentReference.studentUniqueId' as JsonPath,
        ],
        queryFieldMapping,
      },
    },
  } as unknown as TopLevelEntity;
}

describe('OpenApiChangeQuerySchemaBuilder', () => {
  describe('when creating schemas for a regular resource', () => {
    const entity: TopLevelEntity = topLevelEntityWith(
      'association',
      'StudentSchoolAssociation',
      false,
      regularResourceQueryFieldMapping(),
    );

    it('should create tracked-change schemas from public identity query fields', () => {
      expect(createTrackedChangeSchemasFrom(entity)).toMatchInlineSnapshot(`
        Object {
          "EdFi_StudentSchoolAssociation_TrackedChangeDelete": Object {
            "properties": Object {
              "changeVersion": Object {
                "format": "int64",
                "type": "integer",
              },
              "id": Object {
                "type": "string",
              },
              "keyValues": Object {
                "$ref": "#/components/schemas/EdFi_StudentSchoolAssociation_TrackedChangeKey",
              },
            },
            "required": Array [
              "id",
              "changeVersion",
              "keyValues",
            ],
            "type": "object",
          },
          "EdFi_StudentSchoolAssociation_TrackedChangeKey": Object {
            "properties": Object {
              "entryGradeLevelDescriptor": Object {
                "maxLength": 306,
                "type": "string",
              },
              "schoolId": Object {
                "format": "int32",
                "type": "integer",
              },
              "studentUniqueId": Object {
                "maxLength": 32,
                "minLength": 1,
                "type": "string",
              },
            },
            "required": Array [
              "entryGradeLevelDescriptor",
              "schoolId",
              "studentUniqueId",
            ],
            "type": "object",
          },
          "EdFi_StudentSchoolAssociation_TrackedChangeKeyChange": Object {
            "properties": Object {
              "changeVersion": Object {
                "format": "int64",
                "type": "integer",
              },
              "id": Object {
                "type": "string",
              },
              "newKeyValues": Object {
                "$ref": "#/components/schemas/EdFi_StudentSchoolAssociation_TrackedChangeKey",
              },
              "oldKeyValues": Object {
                "$ref": "#/components/schemas/EdFi_StudentSchoolAssociation_TrackedChangeKey",
              },
            },
            "required": Array [
              "id",
              "changeVersion",
              "oldKeyValues",
              "newKeyValues",
            ],
            "type": "object",
          },
        }
      `);
    });
  });

  describe('when creating schemas for a concrete resource without public identity field metadata', () => {
    const entity: TopLevelEntity = topLevelEntityWith('domainEntity', 'Student', false, {});

    it('should not create tracked-change schemas', () => {
      expect(createTrackedChangeSchemasFrom(entity)).toMatchInlineSnapshot(`Object {}`);
    });
  });

  describe('when creating schemas for a descriptor', () => {
    const entity: TopLevelEntity = {
      type: 'descriptor',
      metaEdName: 'GradeLevel',
      namespace: {
        namespaceName: 'EdFi',
      },
      data: {
        edfiApiSchema: {},
      },
    } as unknown as TopLevelEntity;

    it('should create tracked-change schemas with descriptor public identity fields', () => {
      expect(createTrackedChangeSchemasFrom(entity)).toMatchInlineSnapshot(`
        Object {
          "EdFi_GradeLevelDescriptor_TrackedChangeDelete": Object {
            "properties": Object {
              "changeVersion": Object {
                "format": "int64",
                "type": "integer",
              },
              "id": Object {
                "type": "string",
              },
              "keyValues": Object {
                "$ref": "#/components/schemas/EdFi_GradeLevelDescriptor_TrackedChangeKey",
              },
            },
            "required": Array [
              "id",
              "changeVersion",
              "keyValues",
            ],
            "type": "object",
          },
          "EdFi_GradeLevelDescriptor_TrackedChangeKey": Object {
            "properties": Object {
              "codeValue": Object {
                "maxLength": 50,
                "type": "string",
              },
              "namespace": Object {
                "maxLength": 255,
                "type": "string",
              },
            },
            "required": Array [
              "namespace",
              "codeValue",
            ],
            "type": "object",
          },
          "EdFi_GradeLevelDescriptor_TrackedChangeKeyChange": Object {
            "properties": Object {
              "changeVersion": Object {
                "format": "int64",
                "type": "integer",
              },
              "id": Object {
                "type": "string",
              },
              "newKeyValues": Object {
                "$ref": "#/components/schemas/EdFi_GradeLevelDescriptor_TrackedChangeKey",
              },
              "oldKeyValues": Object {
                "$ref": "#/components/schemas/EdFi_GradeLevelDescriptor_TrackedChangeKey",
              },
            },
            "required": Array [
              "id",
              "changeVersion",
              "oldKeyValues",
              "newKeyValues",
            ],
            "type": "object",
          },
        }
      `);
    });
  });

  describe('when creating schemas for a concrete subclass resource', () => {
    const entity: TopLevelEntity = topLevelEntityWith(
      'domainEntitySubclass',
      'School',
      false,
      regularResourceQueryFieldMapping(),
    );

    it('should create tracked-change schemas for the concrete resource', () => {
      expect(Object.keys(createTrackedChangeSchemasFrom(entity))).toMatchInlineSnapshot(`
        Array [
          "EdFi_School_TrackedChangeKey",
          "EdFi_School_TrackedChangeDelete",
          "EdFi_School_TrackedChangeKeyChange",
        ]
      `);
    });
  });

  describe('when creating schemas for an abstract resource', () => {
    const entity: TopLevelEntity = topLevelEntityWith(
      'domainEntity',
      'EducationOrganization',
      true,
      regularResourceQueryFieldMapping(),
    );

    it('should not create tracked-change schemas', () => {
      expect(createTrackedChangeSchemasFrom(entity)).toMatchInlineSnapshot(`Object {}`);
    });
  });
});
