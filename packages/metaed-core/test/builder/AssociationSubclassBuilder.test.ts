// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { AssociationSubclassBuilder } from '../../src/builder/AssociationSubclassBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getAssociationSubclass } from '../TestHelper';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building association subclass in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const baseEntityName = 'BaseEntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, baseEntityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association subclass', (): void => {
    expect(namespace.entity.associationSubclass.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName)).toBeDefined();
    expect(getAssociationSubclass(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have base name', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).baseEntityName).toBe(baseEntityName);
  });

  it('should have base namespace', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).baseEntityNamespaceName).toBe(namespaceName);
  });

  it('should have documentation', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should not be deprecated', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).isDeprecated).toBe(false);
  });

  it('should have one property', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const integerProperty = getAssociationSubclass(namespace.entity, entityName).properties[0];

    expect(integerProperty.metaEdName).toBe(propertyName);
    expect(integerProperty.type).toBe('integer');
    expect(integerProperty.isRequired).toBe(true);
  });
});

describe('when building deprecated association subclass', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const baseEntityName = 'BaseEntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, baseEntityName)
      .withDeprecated(deprecationReason)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association subclass', (): void => {
    expect(namespace.entity.associationSubclass.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).isDeprecated).toBe(true);
    expect(getAssociationSubclass(namespace.entity, entityName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building association subclass in extension namespace subclassing core entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const coreNamespaceName = 'EdFi';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const baseEntityName = 'BaseEntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, `${coreNamespaceName}.${baseEntityName}`)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have base name', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).baseEntityName).toBe(baseEntityName);
  });

  it('should have base namespace', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).baseEntityNamespaceName).toBe(coreNamespaceName);
  });
});

describe('when building duplicate association subclasses', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const baseEntityName = 'BaseEntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, baseEntityName)
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationSubclass()

      .withStartAssociationSubclass(entityName, baseEntityName)
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association subclass', (): void => {
    expect(namespace.entity.associationSubclass.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName)).toBeDefined();
    expect(getAssociationSubclass(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Association Subclass named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 14,
        "line": 9,
        "tokenText": "EntityName",
      }
    `);

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Association Subclass named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 14,
        "line": 2,
        "tokenText": "EntityName",
      }
    `);
  });
});

describe('when building association subclass with no association subclass name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const baseEntityName = 'BaseEntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, baseEntityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build association subclass', (): void => {
    expect(namespace.entity.associationExtension.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "no viable alternative at input 'Associationbased on', column: 15, line: 2, token: based on",
        "no viable alternative at input 'Associationbased on', column: 15, line: 2, token: based on",
      ]
    `);
  });
});

describe('when building association subclass with lowercase association subclass name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const baseEntityName = 'BaseEntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, baseEntityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build association subclass', (): void => {
    expect(namespace.entity.associationExtension.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "no viable alternative at input 'Associatione', column: 14, line: 2, token: e",
        "no viable alternative at input 'Associatione', column: 14, line: 2, token: e",
      ]
    `);
  });
});

describe('when building association subclass with no based on name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const baseEntityName = '';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, baseEntityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association subclass', (): void => {
    expect(namespace.entity.associationSubclass.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName)).toBeDefined();
    expect(getAssociationSubclass(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have base name', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).baseEntityName).toBe(baseEntityName);
  });

  it('should have documentation', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have one property', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const integerProperty = getAssociationSubclass(namespace.entity, entityName).properties[0];

    expect(integerProperty.metaEdName).toBe(propertyName);
    expect(integerProperty.type).toBe('integer');
    expect(integerProperty.isRequired).toBe(true);
  });

  it('should have error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'documentation' expecting ID, column: 4, line: 3, token: documentation",
        "mismatched input 'documentation' expecting ID, column: 4, line: 3, token: documentation",
      ]
    `);
  });
});

describe('when building association subclass with lowercase based on name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const baseEntityName = 'baseEntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, baseEntityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association subclass', (): void => {
    expect(namespace.entity.associationSubclass.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName)).toBeDefined();
    expect(getAssociationSubclass(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have one property', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const integerProperty = getAssociationSubclass(namespace.entity, entityName).properties[0];

    expect(integerProperty.metaEdName).toBe(propertyName);
    expect(integerProperty.type).toBe('integer');
    expect(integerProperty.isRequired).toBe(true);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'b' expecting ID, column: 34, line: 2, token: b",
        "mismatched input 'b' expecting ID, column: 34, line: 2, token: b",
      ]
    `);
  });
});

describe('when building association subclass with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const baseEntityName = 'BaseEntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, baseEntityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association subclass', (): void => {
    expect(namespace.entity.associationSubclass.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName)).toBeDefined();
    expect(getAssociationSubclass(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have base name but with lowercase prefix ignored', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).baseEntityName).toBe(baseEntityName);
  });

  it('should have no documentation', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).documentation).toBe('');
  });

  it('should have no property', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'integer' expecting {'deprecated', 'documentation', METAED_ID}, column: 4, line: 3, token: integer",
        "mismatched input 'integer' expecting {'deprecated', 'documentation', METAED_ID}, column: 4, line: 3, token: integer",
      ]
    `);
  });
});

describe('when building association subclass with no property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const baseEntityName = 'BaseEntityName';
  const documentation = 'Documentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, baseEntityName)
      .withDocumentation(documentation)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association subclass', (): void => {
    expect(namespace.entity.associationSubclass.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName)).toBeDefined();
    expect(getAssociationSubclass(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have base name but with lowercase prefix ignored', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).baseEntityName).toBe(baseEntityName);
  });

  it('should have documentation', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no property', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'End Namespace' expecting {'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year'}, column: 0, line: 5, token: End Namespace",
        "mismatched input 'End Namespace' expecting {'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year'}, column: 0, line: 5, token: End Namespace",
      ]
    `);
  });
});

describe('when building association subclass with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const baseEntityName = 'BaseEntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, baseEntityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withTrailingText(trailingText)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one association subclass', (): void => {
    expect(namespace.entity.associationSubclass.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName)).toBeDefined();
    expect(getAssociationSubclass(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have base name', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).baseEntityName).toBe(baseEntityName);
  });

  it('should have documentation', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have one property', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    const integerProperty = getAssociationSubclass(namespace.entity, entityName).properties[0];

    expect(integerProperty.metaEdName).toBe(propertyName);
    expect(integerProperty.type).toBe('integer');
    expect(integerProperty.isRequired).toBe(true);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'is queryable field', 'min value', 'max value', 'role name'}, column: 0, line: 9, token: TrailingText",
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'is queryable field', 'min value', 'max value', 'role name'}, column: 0, line: 9, token: TrailingText",
      ]
    `);
  });
});

describe('when building association subclass source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const baseEntityName = 'BaseEntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new AssociationSubclassBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociationSubclass(entityName, baseEntityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have a baseEntityName property', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).sourceMap.baseEntityName).toBeDefined();
  });

  it('should have a documentation property', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have a metaEdName property', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have a type property', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have source map data', (): void => {
    expect(getAssociationSubclass(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
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
          "column": 34,
          "line": 2,
          "tokenText": "BaseEntityName",
        },
        "baseEntityNamespaceName": Object {
          "column": 34,
          "line": 2,
          "tokenText": "BaseEntityName",
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
        "identityProperties": Array [],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 14,
          "line": 2,
          "tokenText": "EntityName",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Association",
        },
      }
    `);
  });
});
