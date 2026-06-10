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
import type { PathType } from '../../src/model/api-schema/PathType';
import type { QueryFieldMapping } from '../../src/model/api-schema/QueryFieldMapping';

/**
 * A tracked-change identity source property case used to verify scalar OpenAPI schema mapping.
 */
type ScalarIdentitySourcePropertyCase = {
  fieldName: string;
  identityJsonPath: JsonPath;
  pathType: PathType;
  sourceProperty: EntityProperty;
};

/**
 * Creates a source property with only semantic type and documentation needed by tracked-change schema tests.
 */
function sourcePropertyOfType(propertyType: EntityProperty['type'], documentation: string): EntityProperty {
  return {
    ...newEntityProperty(),
    type: propertyType,
    documentation,
  };
}

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
 * Creates a big integer source property for tracked-change schema tests.
 */
function bigIntegerSourceProperty(): EntityProperty {
  return {
    ...newEntityProperty(),
    type: 'integer',
    documentation: 'Big integer identity field',
    hasBigHint: true,
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
 * Creates source property cases for tracked-change scalar schema mapping tests.
 */
function scalarIdentitySourcePropertyCases(): ScalarIdentitySourcePropertyCase[] {
  return [
    {
      fieldName: 'booleanIdentity',
      identityJsonPath: '$.booleanIdentity' as JsonPath,
      pathType: 'boolean',
      sourceProperty: sourcePropertyOfType('boolean', 'Boolean identity field'),
    },
    {
      fieldName: 'dateIdentity',
      identityJsonPath: '$.dateIdentity' as JsonPath,
      pathType: 'date',
      sourceProperty: sourcePropertyOfType('date', 'Date identity field'),
    },
    {
      fieldName: 'dateTimeIdentity',
      identityJsonPath: '$.dateTimeIdentity' as JsonPath,
      pathType: 'date-time',
      sourceProperty: sourcePropertyOfType('datetime', 'Date-time identity field'),
    },
    {
      fieldName: 'decimalIdentity',
      identityJsonPath: '$.decimalIdentity' as JsonPath,
      pathType: 'number',
      sourceProperty: sourcePropertyOfType('decimal', 'Decimal identity field'),
    },
    {
      fieldName: 'descriptorIdentity',
      identityJsonPath: '$.descriptorIdentity' as JsonPath,
      pathType: 'string',
      sourceProperty: descriptorSourceProperty(),
    },
    {
      fieldName: 'durationIdentity',
      identityJsonPath: '$.durationIdentity' as JsonPath,
      pathType: 'string',
      sourceProperty: sourcePropertyOfType('duration', 'Duration identity field'),
    },
    {
      fieldName: 'int64Identity',
      identityJsonPath: '$.int64Identity' as JsonPath,
      pathType: 'number',
      sourceProperty: bigIntegerSourceProperty(),
    },
    {
      fieldName: 'schoolYearIdentity',
      identityJsonPath: '$.schoolYearIdentity' as JsonPath,
      pathType: 'number',
      sourceProperty: sourcePropertyOfType('schoolYearEnumeration', 'School year identity field'),
    },
    {
      fieldName: 'stringIdentity',
      identityJsonPath: '$.stringIdentity' as JsonPath,
      pathType: 'string',
      sourceProperty: stringSourceProperty(),
    },
    {
      fieldName: 'timeIdentity',
      identityJsonPath: '$.timeIdentity' as JsonPath,
      pathType: 'time',
      sourceProperty: sourcePropertyOfType('time', 'Time identity field'),
    },
    {
      fieldName: 'yearIdentity',
      identityJsonPath: '$.yearIdentity' as JsonPath,
      pathType: 'number',
      sourceProperty: sourcePropertyOfType('year', 'Year identity field'),
    },
  ];
}

/**
 * Creates query field mapping metadata from scalar source property cases.
 */
function queryFieldMappingFrom(sourcePropertyCases: ScalarIdentitySourcePropertyCase[]): QueryFieldMapping {
  const result: QueryFieldMapping = {};

  sourcePropertyCases.forEach((sourcePropertyCase: ScalarIdentitySourcePropertyCase) => {
    result[sourcePropertyCase.fieldName] = [
      {
        path: sourcePropertyCase.identityJsonPath,
        type: sourcePropertyCase.pathType,
        sourceProperty: sourcePropertyCase.sourceProperty,
      },
    ];
  });

  return result;
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
 * Creates a top-level entity with explicit identity paths for tracked-change schema generation.
 */
function topLevelEntityWithIdentityJsonPaths(
  type: string,
  metaEdName: string,
  isAbstract: boolean,
  identityJsonPaths: JsonPath[],
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
        identityJsonPaths,
        queryFieldMapping,
      },
    },
  } as unknown as TopLevelEntity;
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
  return topLevelEntityWithIdentityJsonPaths(
    type,
    metaEdName,
    isAbstract,
    [
      '$.entryGradeLevelDescriptor' as JsonPath,
      '$.schoolReference.schoolId' as JsonPath,
      '$.studentReference.studentUniqueId' as JsonPath,
    ],
    queryFieldMapping,
  );
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

  describe('when creating key schemas from scalar identity source properties', () => {
    const sourcePropertyCases: ScalarIdentitySourcePropertyCase[] = scalarIdentitySourcePropertyCases();
    const entity: TopLevelEntity = topLevelEntityWithIdentityJsonPaths(
      'domainEntity',
      'ScalarIdentityResource',
      false,
      sourcePropertyCases.map((sourcePropertyCase: ScalarIdentitySourcePropertyCase) => sourcePropertyCase.identityJsonPath),
      queryFieldMappingFrom(sourcePropertyCases),
    );

    it('should use the standard OpenAPI schema mapping for tracked-change identity fields', () => {
      expect(createTrackedChangeSchemasFrom(entity).EdFi_ScalarIdentityResource_TrackedChangeKey).toMatchInlineSnapshot(`
        Object {
          "properties": Object {
            "booleanIdentity": Object {
              "type": "boolean",
            },
            "dateIdentity": Object {
              "format": "date",
              "type": "string",
            },
            "dateTimeIdentity": Object {
              "format": "date-time",
              "type": "string",
            },
            "decimalIdentity": Object {
              "format": "double",
              "type": "number",
            },
            "descriptorIdentity": Object {
              "maxLength": 306,
              "type": "string",
            },
            "durationIdentity": Object {
              "maxLength": 30,
              "type": "string",
            },
            "int64Identity": Object {
              "format": "int64",
              "type": "integer",
            },
            "schoolYearIdentity": Object {
              "format": "int32",
              "type": "integer",
            },
            "stringIdentity": Object {
              "maxLength": 32,
              "minLength": 1,
              "type": "string",
            },
            "timeIdentity": Object {
              "type": "string",
            },
            "yearIdentity": Object {
              "format": "int32",
              "type": "integer",
            },
          },
          "required": Array [
            "booleanIdentity",
            "dateIdentity",
            "dateTimeIdentity",
            "decimalIdentity",
            "descriptorIdentity",
            "durationIdentity",
            "int64Identity",
            "schoolYearIdentity",
            "stringIdentity",
            "timeIdentity",
            "yearIdentity",
          ],
          "type": "object",
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
