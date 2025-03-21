// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnumerationBuilder } from '../../src/builder/EnumerationBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getSchoolYearEnumeration } from '../TestHelper';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building school year enumeration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityType = 'schoolYearEnumeration';
  const entityName = 'SchoolYear';
  const documentation = 'Documentation';
  const itemShortDescription = 'ItemShortDescription';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one school year enumeration', (): void => {
    expect(namespace.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSchoolYearEnumeration(namespace.entity, entityName)).toBeDefined();
    expect(getSchoolYearEnumeration(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have type', (): void => {
    expect(getSchoolYearEnumeration(namespace.entity, entityName).type).toBe(entityType);
  });

  it('should have source map for type', (): void => {
    expect(getSchoolYearEnumeration(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have source map with line, column, text', (): void => {
    expect(getSchoolYearEnumeration(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
      Object {
        "allowPrimaryKeyUpdates": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityNamespaceName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 4,
          "line": 3,
          "tokenText": "documentation",
        },
        "enumerationItems": Array [
          Object {
            "column": 4,
            "line": 5,
            "tokenText": "item",
          },
        ],
        "identityProperties": Array [],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 14,
          "line": 2,
          "tokenText": "SchoolYear",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 14,
          "line": 2,
          "tokenText": "SchoolYear",
        },
      }
    `);
  });
});
