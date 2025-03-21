// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DescriptorBuilder } from '../../src/builder/DescriptorBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getDescriptor, getMapTypeEnumeration } from '../TestHelper';
import { DescriptorSourceMap } from '../../src/model/Descriptor';
import { EnumerationSourceMap } from '../../src/model/Enumeration';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building descriptor without map type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDescriptor(namespace.entity, entityName)).toBeDefined();
    expect(getDescriptor(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should not be deprecated', (): void => {
    expect(getDescriptor(namespace.entity, entityName).isDeprecated).toBe(false);
  });

  it('should have one property', (): void => {
    expect(getDescriptor(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    expect(getDescriptor(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDescriptor(namespace.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should not have map type enumeration', (): void => {
    expect(getDescriptor(namespace.entity, entityName).isMapTypeOptional).toBe(false);
    expect(getDescriptor(namespace.entity, entityName).isMapTypeRequired).toBe(false);
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems).toHaveLength(0);
  });
});

describe('when building deprecated descriptor', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDeprecated(deprecationReason)
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getDescriptor(namespace.entity, entityName).isDeprecated).toBe(true);
    expect(getDescriptor(namespace.entity, entityName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building multiple descriptors', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDescriptor()

      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDescriptor(namespace.entity, entityName)).toBeDefined();
    expect(getDescriptor(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Descriptor named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 13,
        "line": 9,
        "tokenText": "EntityName",
      }
    `);

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Descriptor named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 13,
        "line": 2,
        "tokenText": "EntityName",
      }
    `);
  });
});

describe('when building descriptor with optional map type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const mapTypeDocumentation = 'MapTypeDocumentation';
  const itemShortDescription = 'ItemShortDescription';
  const itemDocumentation = 'ItemDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withStartMapType(false)
      .withDocumentation(mapTypeDocumentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation)
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDescriptor(namespace.entity, entityName)).toBeDefined();
    expect(getDescriptor(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no properties', (): void => {
    expect(getDescriptor(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have optional map type enumeration', (): void => {
    expect(getDescriptor(namespace.entity, entityName).isMapTypeOptional).toBe(true);
    expect(getDescriptor(namespace.entity, entityName).isMapTypeRequired).toBe(false);
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems).not.toHaveLength(0);
  });

  it('should have map type enumeration in entityRepository', (): void => {
    expect(namespace.entity.mapTypeEnumeration.size).toBe(1);
    expect(getMapTypeEnumeration(namespace.entity, `${entityName}Map`)).toBeDefined();
    expect(getMapTypeEnumeration(namespace.entity, `${entityName}Map`).metaEdName).toBe(`${entityName}Map`);
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.metaEdName).toBe(`${entityName}Map`);
  });

  it('should have map type enumeration documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.documentation).toBe(mapTypeDocumentation);
  });

  it('should have map type enumeration with one enumeration item', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems).toHaveLength(1);
  });

  it('should have enumeration item with short description', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems[0].shortDescription).toBe(
      itemShortDescription,
    );
  });

  it('should have enumeration item with documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems[0].documentation).toBe(
      itemDocumentation,
    );
  });
});

describe('when building descriptor with required map type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const mapTypeDocumentation = 'MapTypeDocumentation';
  const itemShortDescription = 'ItemShortDescription';
  const itemDocumentation = 'ItemDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withStartMapType(true)
      .withDocumentation(mapTypeDocumentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation)
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDescriptor(namespace.entity, entityName)).toBeDefined();
    expect(getDescriptor(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no properties', (): void => {
    expect(getDescriptor(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have required map type enumeration', (): void => {
    expect(getDescriptor(namespace.entity, entityName).isMapTypeOptional).toBe(false);
    expect(getDescriptor(namespace.entity, entityName).isMapTypeRequired).toBe(true);
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems).not.toHaveLength(0);
  });

  it('should have map type enumeration in entityRepository', (): void => {
    expect(namespace.entity.mapTypeEnumeration.size).toBe(1);
    expect(getMapTypeEnumeration(namespace.entity, `${entityName}Map`)).toBeDefined();
    expect(getMapTypeEnumeration(namespace.entity, `${entityName}Map`).metaEdName).toBe(`${entityName}Map`);
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.metaEdName).toBe(`${entityName}Map`);
  });

  it('should have map type enumeration documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.documentation).toBe(mapTypeDocumentation);
  });

  it('should have map type enumeration with one enumeration item', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems).toHaveLength(1);
  });

  it('should have enumeration item with short description', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems[0].shortDescription).toBe(
      itemShortDescription,
    );
  });

  it('should have enumeration item with documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems[0].documentation).toBe(
      itemDocumentation,
    );
  });
});

describe('when building descriptor with no descriptor name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const documentation = 'Documentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(0);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "missing ID at 'documentation', column: 4, line: 3, token: documentation",
        "missing ID at 'documentation', column: 4, line: 3, token: documentation",
      ]
    `);
  });
});

describe('when building descriptor with lowercase descriptor name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build no descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(0);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'e' expecting ID, column: 13, line: 2, token: e",
        "mismatched input 'e' expecting ID, column: 13, line: 2, token: e",
      ]
    `);
  });
});

describe('when building descriptor with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(1);
  });

  it('should be found in entity repository but with lowercase prefix ignored', (): void => {
    expect(getDescriptor(namespace.entity, entityName)).toBeDefined();
    expect(getDescriptor(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should not have documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).documentation).toBe('');
  });

  it('should have no properties', (): void => {
    expect(getDescriptor(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should not have map type enumeration', (): void => {
    expect(getDescriptor(namespace.entity, entityName).isMapTypeOptional).toBe(false);
    expect(getDescriptor(namespace.entity, entityName).isMapTypeRequired).toBe(false);
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems).toHaveLength(0);
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

describe('when building descriptor with no documentation in map type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const itemShortDescription = 'ItemShortDescription';
  const itemDocumentation = 'ItemDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withStartMapType(true)
      .withEnumerationItem(itemShortDescription, itemDocumentation)
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDescriptor(namespace.entity, entityName)).toBeDefined();
    expect(getDescriptor(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no properties', (): void => {
    expect(getDescriptor(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have required map type enumeration', (): void => {
    expect(getDescriptor(namespace.entity, entityName).isMapTypeOptional).toBe(false);
    expect(getDescriptor(namespace.entity, entityName).isMapTypeRequired).toBe(true);
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems).not.toHaveLength(0);
  });

  it('should have map type enumeration in entityRepository', (): void => {
    expect(namespace.entity.mapTypeEnumeration.size).toBe(1);
    expect(getMapTypeEnumeration(namespace.entity, `${entityName}Map`)).toBeDefined();
    expect(getMapTypeEnumeration(namespace.entity, `${entityName}Map`).metaEdName).toBe(`${entityName}Map`);
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.metaEdName).toBe(`${entityName}Map`);
  });

  it('should not  have map type enumeration documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.documentation).toBe('');
  });

  it('should have map type enumeration with one enumeration item', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems).toHaveLength(1);
  });

  it('should have enumeration item with short description', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems[0].shortDescription).toBe(
      itemShortDescription,
    );
  });

  it('should have enumeration item with documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems[0].documentation).toBe(
      itemDocumentation,
    );
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'item' expecting 'documentation', column: 6, line: 6, token: item",
        "mismatched input 'item' expecting 'documentation', column: 6, line: 6, token: item",
      ]
    `);
  });
});

describe('when building descriptor with no enumeration item in map type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const mapTypeDocumentation = 'MapTypeDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withStartMapType(true)
      .withDocumentation(mapTypeDocumentation)
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDescriptor(namespace.entity, entityName)).toBeDefined();
    expect(getDescriptor(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no properties', (): void => {
    expect(getDescriptor(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should not have required map type enumeration', (): void => {
    expect(getDescriptor(namespace.entity, entityName).isMapTypeOptional).toBe(false);
    expect(getDescriptor(namespace.entity, entityName).isMapTypeRequired).toBe(true);
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems).toHaveLength(0);
  });

  it('should have map type enumeration in entityRepository', (): void => {
    expect(namespace.entity.mapTypeEnumeration.size).toBe(1);
    expect(getMapTypeEnumeration(namespace.entity, `${entityName}Map`)).toBeDefined();
    expect(getMapTypeEnumeration(namespace.entity, `${entityName}Map`).metaEdName).toBe(`${entityName}Map`);
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.metaEdName).toBe(`${entityName}Map`);
  });

  it('should have map type enumeration documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.documentation).toBe(mapTypeDocumentation);
  });

  it('should have map type enumeration with no enumeration item', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'End Namespace' expecting 'item', column: 0, line: 8, token: End Namespace",
        "mismatched input 'End Namespace' expecting 'item', column: 0, line: 8, token: End Namespace",
      ]
    `);
  });
});

describe('when building descriptor with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withTrailingText(trailingText)
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(1);
  });

  it('should be found in entity repository but with lowercase prefix ignored', (): void => {
    expect(getDescriptor(namespace.entity, entityName)).toBeDefined();
    expect(getDescriptor(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDescriptor(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have one property', (): void => {
    expect(getDescriptor(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', (): void => {
    expect(getDescriptor(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDescriptor(namespace.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should not have map type enumeration', (): void => {
    expect(getDescriptor(namespace.entity, entityName).isMapTypeOptional).toBe(false);
    expect(getDescriptor(namespace.entity, entityName).isMapTypeRequired).toBe(false);
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems).toHaveLength(0);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'is queryable field', 'min value', 'max value', 'role name', 'with optional map type', 'with map type'}, column: 0, line: 9, token: TrailingText",
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'is queryable field', 'min value', 'max value', 'role name', 'with optional map type', 'with map type'}, column: 0, line: 9, token: TrailingText",
      ]
    `);
  });
});

describe('when building descriptor source map with optional map type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStartMapType(false)
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have type', (): void => {
    expect(getDescriptor(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getDescriptor(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have isMapTypeOptional', (): void => {
    expect((getDescriptor(namespace.entity, entityName).sourceMap as DescriptorSourceMap).isMapTypeOptional).toBeDefined();
  });

  it('should have line, column, text for each property', (): void => {
    expect(getDescriptor(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
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
        "identityProperties": Array [],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isMapTypeOptional": Object {
          "column": 4,
          "line": 9,
          "tokenText": "with optional map type",
        },
        "isMapTypeRequired": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "mapTypeEnumeration": Object {
          "column": 4,
          "line": 9,
          "tokenText": "with optional map type",
        },
        "metaEdName": Object {
          "column": 13,
          "line": 2,
          "tokenText": "EntityName",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Descriptor",
        },
      }
    `);
  });
});

describe('when building descriptor source map with required map type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStartMapType(true)
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have isMapTypeRequired', (): void => {
    expect((getDescriptor(namespace.entity, entityName).sourceMap as DescriptorSourceMap).isMapTypeRequired).toBeDefined();
  });

  it('should have mapTypeEnumeration', (): void => {
    expect((getDescriptor(namespace.entity, entityName).sourceMap as DescriptorSourceMap).mapTypeEnumeration).toBeDefined();
  });

  it('should have source map with line, column, text for each property', (): void => {
    expect(getDescriptor(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
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
        "identityProperties": Array [],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isMapTypeOptional": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isMapTypeRequired": Object {
          "column": 4,
          "line": 9,
          "tokenText": "with map type",
        },
        "mapTypeEnumeration": Object {
          "column": 4,
          "line": 9,
          "tokenText": "with map type",
        },
        "metaEdName": Object {
          "column": 13,
          "line": 2,
          "tokenText": "EntityName",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Descriptor",
        },
      }
    `);
  });
});

describe('when building required map type enumeration source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  const mapDocumentation = 'MapDocumentation';
  const shortDescription = 'ShortDescription';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', false, false)
      .withStartMapType(true)
      .withDocumentation(mapDocumentation)
      .withEnumerationItem(shortDescription, 'doc')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have type', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.sourceMap.type).toBeDefined();
  });

  it('should have documentation', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.sourceMap.documentation).toBeDefined();
  });

  it('should have enumerationItems', (): void => {
    expect(
      (getDescriptor(namespace.entity, entityName).mapTypeEnumeration.sourceMap as EnumerationSourceMap).enumerationItems,
    ).toHaveLength(1);
  });

  it('should have line, column, text for each property', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.sourceMap).toMatchInlineSnapshot(`
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
          "column": 6,
          "line": 10,
          "tokenText": "documentation",
        },
        "enumerationItems": Array [
          Object {
            "column": 6,
            "line": 12,
            "tokenText": "item",
          },
        ],
        "identityProperties": Array [],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "mapTypeEnumeration": Object {
          "column": 4,
          "line": 9,
          "tokenText": "with map type",
        },
        "metaEdName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 4,
          "line": 9,
          "tokenText": "with map type",
        },
      }
    `);
  });
});

describe('when building map type enumeration item source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  const mapDocumentation = 'MapDocumentation';
  const shortDescription = 'ShortDescription';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DescriptorBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDescriptor(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStartMapType(true)
      .withDocumentation(mapDocumentation)
      .withEnumerationItem(shortDescription, 'doc')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have type', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems[0].sourceMap.type).toBeDefined();
  });

  it('should have documentation', (): void => {
    expect(
      getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems[0].sourceMap.documentation,
    ).toBeDefined();
  });

  it('should have shortDescription', (): void => {
    expect(
      getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems[0].sourceMap.shortDescription,
    ).toBeDefined();
  });

  it('should have line, column, text for each property', (): void => {
    expect(getDescriptor(namespace.entity, entityName).mapTypeEnumeration.enumerationItems[0].sourceMap)
      .toMatchInlineSnapshot(`
      Object {
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 8,
          "line": 13,
          "tokenText": "documentation",
        },
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "shortDescription": Object {
          "column": 11,
          "line": 12,
          "tokenText": "\\"ShortDescription\\"",
        },
        "type": Object {
          "column": 6,
          "line": 12,
          "tokenText": "item",
        },
        "typeHumanizedName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
      }
    `);
  });
});
