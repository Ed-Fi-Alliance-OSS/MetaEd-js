// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntityBuilder,
  ChoiceBuilder,
  CommonBuilder,
  EnumerationBuilder,
  DescriptorBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  column,
  enhanceGenerateAndExecuteSql,
  foreignKey,
  table,
  testTearDown,
  columnDataTypes,
  testSuiteAfterAll,
} from './DatabaseTestBase';
import { columnExists, columnIsNullable, columnDataType, columnDefaultConstraint } from './DatabaseColumn';
import { foreignKeyDeleteCascades, foreignKeyExists } from './DatabaseForeignKey';
import { tableExists, tablePrimaryKeys } from './DatabaseTable';
import { DatabaseColumn } from './DatabaseColumn';
import { DatabaseForeignKey } from './DatabaseForeignKey';

jest.setTimeout(40000);

afterAll(async () => testSuiteAfterAll());

describe('when inline common is a required property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const inlineCommonName = 'InlineCommonName';
  const optionalPropertyContext = 'OptionalPropertyContext';
  const inlinePropertyContext = 'InlinePropertyContext';
  const domainEntityName = 'DomainEntityName';
  const optionalPropertyName = 'OptionalPropertyName';
  const requiredPropertyName = 'RequiredPropertyName';
  const collectionPropertyName = 'CollectionPropertyName';
  const inlineCommonIdentityPropertyName = 'InlineCommonIdentityPropertyName';
  const domainEntityIdentityPropertyName = 'DomainEntityIdentityPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(optionalPropertyName, 'Documentation', false, false)
      .withIntegerProperty(optionalPropertyName, 'Documentation', false, false, null, null, optionalPropertyContext)
      .withIntegerProperty(requiredPropertyName, 'Documentation', true, false)
      .withIntegerProperty(collectionPropertyName, 'Documentation', false, true)
      .withIntegerIdentity(inlineCommonIdentityPropertyName, 'Documentation')
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(domainEntityIdentityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', true, false)
      .withInlineCommonProperty(inlineCommonName, 'Documentation', true, false, inlinePropertyContext)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have domain entity identity', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, domainEntityIdentityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have inline common properties', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, inlineCommonIdentityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);

    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, optionalPropertyName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);

    const contextColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName,
      optionalPropertyContext + optionalPropertyName,
    );
    expect(await columnExists(contextColumn)).toBe(true);
    expect(await columnIsNullable(contextColumn)).toBe(true);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredPropertyName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
  });

  it('should have inline common properties role name', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName,
      inlinePropertyContext + inlineCommonIdentityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName,
      inlinePropertyContext + optionalPropertyName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);

    const contextColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName,
      inlinePropertyContext + optionalPropertyContext + optionalPropertyName,
    );
    expect(await columnExists(contextColumn)).toBe(true);
    expect(await columnIsNullable(contextColumn)).toBe(true);

    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName,
      inlinePropertyContext + requiredPropertyName,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([
      domainEntityIdentityPropertyName,
      inlineCommonIdentityPropertyName,
      inlinePropertyContext + inlineCommonIdentityPropertyName,
    ]);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + collectionPropertyName))).toBe(true);
  });

  it('should have collection property', async () => {
    const collectionColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + collectionPropertyName,
      collectionPropertyName,
    );
    expect(await columnExists(collectionColumn)).toBe(true);
    expect(await columnIsNullable(collectionColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + collectionPropertyName))).toEqual([
      collectionPropertyName,
      domainEntityIdentityPropertyName,
      inlineCommonIdentityPropertyName,
      inlinePropertyContext + inlineCommonIdentityPropertyName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + collectionPropertyName, domainEntityIdentityPropertyName)],
      [column(namespaceName, domainEntityName, domainEntityIdentityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(namespaceName, domainEntityName + collectionPropertyName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, domainEntityName + collectionPropertyName, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + collectionPropertyName,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });

  it('should have collection table role name', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + inlinePropertyContext + collectionPropertyName))).toBe(
      true,
    );
  });

  it('should have collection property', async () => {
    const collectionColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + collectionPropertyName,
      collectionPropertyName,
    );
    expect(await columnExists(collectionColumn)).toBe(true);
    expect(await columnIsNullable(collectionColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(
      await tablePrimaryKeys(table(namespaceName, domainEntityName + inlinePropertyContext + collectionPropertyName)),
    ).toEqual([
      domainEntityIdentityPropertyName,
      inlineCommonIdentityPropertyName,
      inlinePropertyContext + collectionPropertyName,
      inlinePropertyContext + inlineCommonIdentityPropertyName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(
          namespaceName,
          domainEntityName + inlinePropertyContext + collectionPropertyName,
          domainEntityIdentityPropertyName,
        ),
      ],
      [column(namespaceName, domainEntityName, domainEntityIdentityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + inlinePropertyContext + collectionPropertyName,
      'CreateDate',
    );
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + inlinePropertyContext + collectionPropertyName,
      'Id',
    );
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + inlinePropertyContext + collectionPropertyName,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });
});

describe('when inline common is an optional property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const inlineCommonName = 'InlineCommonName';
  const domainEntityName = 'DomainEntityName';
  const optionalPropertyName = 'OptionalPropertyName';
  const requiredPropertyName = 'RequiredPropertyName';
  const collectionPropertyName = 'CollectionPropertyName';
  const domainEntityIdentityPropertyName = 'DomainEntityIdentityPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(optionalPropertyName, 'Documentation', false, false)
      .withIntegerProperty(requiredPropertyName, 'Documentation', true, false)
      .withIntegerProperty(collectionPropertyName, 'Documentation', false, true)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(domainEntityIdentityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have domain entity identity', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, domainEntityIdentityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have inline common properties', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, optionalPropertyName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredPropertyName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([domainEntityIdentityPropertyName]);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + collectionPropertyName))).toBe(true);
  });

  it('should have collection property and domain entity property', async () => {
    const collectionColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + collectionPropertyName,
      collectionPropertyName,
    );
    expect(await columnExists(collectionColumn)).toBe(true);
    expect(await columnIsNullable(collectionColumn)).toBe(false);

    const entityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + collectionPropertyName,
      domainEntityIdentityPropertyName,
    );
    expect(await columnExists(entityColumn)).toBe(true);
    expect(await columnIsNullable(entityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + collectionPropertyName))).toEqual([
      collectionPropertyName,
      domainEntityIdentityPropertyName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + collectionPropertyName, domainEntityIdentityPropertyName)],
      [column(namespaceName, domainEntityName, domainEntityIdentityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(namespaceName, domainEntityName + collectionPropertyName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, domainEntityName + collectionPropertyName, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + collectionPropertyName,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });
});

describe('when inline common is an optional property with required enumeration property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const enumerationName = 'EnumerationName';
  const enumerationItemName = 'EnumerationItemName';
  const inlineCommonName = 'InlineCommonName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityIdentityPropertyName = 'DomainEntityIdentityPropertyName';
  const enumerationTableName = `${enumerationName}Type`;
  const enumerationColumnName = `${enumerationName}TypeId`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(enumerationName)
      .withDocumentation('Documentation')
      .withEnumerationItem(enumerationItemName)
      .withEndEnumeration()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withEnumerationProperty(enumerationName, 'Documentation', true, false)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(domainEntityIdentityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have type id property', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, domainEntityName, enumerationColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(true);
  });

  it('should have type table', async () => {
    expect(await tableExists(table(namespaceName, enumerationTableName))).toBe(true);
  });

  it('should have type id property', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, enumerationTableName, enumerationColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, enumerationTableName))).toEqual([enumerationColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName, enumerationColumnName)],
      [column(namespaceName, enumerationTableName, enumerationColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when inline common has optional enumeration property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const enumerationName = 'EnumerationName';
  const enumerationItemName = 'EnumerationItemName';
  const inlineCommonName = 'InlineCommonName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityIdentityPropertyName = 'DomainEntityIdentityPropertyName';
  const enumerationTableName = `${enumerationName}Type`;
  const enumerationColumnName = `${enumerationName}TypeId`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(enumerationName)
      .withDocumentation('Documentation')
      .withEnumerationItem(enumerationItemName)
      .withEndEnumeration()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withEnumerationProperty(enumerationName, 'Documentation', false, false)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(domainEntityIdentityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have type id property', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, domainEntityName, enumerationColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(true);
  });

  it('should have type table', async () => {
    expect(await tableExists(table(namespaceName, enumerationTableName))).toBe(true);
  });

  it('should have type id property', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, enumerationTableName, enumerationColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, enumerationTableName))).toEqual([enumerationColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName, enumerationColumnName)],
      [column(namespaceName, enumerationTableName, enumerationColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when inline common has collection enumeration property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const enumerationName = 'EnumerationName';
  const enumerationItemName = 'EnumerationItemName';
  const inlineCommonName = 'InlineCommonName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityIdentityPropertyName = 'DomainEntityIdentityPropertyName';
  const enumerationTableName = `${enumerationName}Type`;
  const enumerationColumnName = `${enumerationName}TypeId`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(enumerationName)
      .withDocumentation('Documentation')
      .withEnumerationItem(enumerationItemName)
      .withEndEnumeration()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withEnumerationProperty(enumerationName, 'Documentation', false, true)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(domainEntityIdentityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have identity property', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, domainEntityIdentityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([domainEntityIdentityPropertyName]);
  });

  it('should have type table', async () => {
    expect(await tableExists(table(namespaceName, enumerationTableName))).toBe(true);
  });

  it('should have type id property', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, enumerationTableName, enumerationColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, enumerationTableName))).toEqual([enumerationColumnName]);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + enumerationName))).toBe(true);
  });

  it('should have identity and type id properties', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + enumerationName,
      domainEntityIdentityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);

    const typeIdColumn: DatabaseColumn = column(namespaceName, domainEntityName + enumerationName, enumerationColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + enumerationName))).toEqual([
      domainEntityIdentityPropertyName,
      enumerationColumnName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + enumerationName, domainEntityIdentityPropertyName)],
      [column(namespaceName, domainEntityName, domainEntityIdentityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + enumerationName, enumerationColumnName)],
      [column(namespaceName, enumerationTableName, enumerationColumnName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);
  });
});

describe('when inline common has descriptor property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const baseDescriptorTableName = 'Descriptor';
  const descriptorName = 'DescriptorName';
  const inlineCommonName = 'InlineCommonName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityIdentityPropertyName = 'DomainEntityIdentityPropertyName';
  const descriptorTableName = `${descriptorName}Descriptor`;
  const descriptorColumnName = `${descriptorName}DescriptorId`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('Documentation')
      .withEndDescriptor()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withDescriptorProperty(descriptorName, 'Documentation', false, false)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(domainEntityIdentityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have descriptor id property', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, domainEntityName, descriptorColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(true);
  });

  it('should have descriptor table', async () => {
    expect(await tableExists(table(namespaceName, descriptorTableName))).toBe(true);
  });

  it('should have descriptor id property', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, descriptorColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName))).toEqual([descriptorColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName, descriptorColumnName)],
      [column(namespaceName, descriptorTableName, descriptorColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, descriptorColumnName)],
      [column(namespaceName, baseDescriptorTableName, `${baseDescriptorTableName}Id`)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});

describe('when inline common has collection descriptor property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const baseDescriptorTableName = 'Descriptor';
  const descriptorName = 'DescriptorName';
  const inlineCommonName = 'InlineCommonName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityIdentityPropertyName = 'DomainEntityIdentityPropertyName';
  const descriptorTableName = `${descriptorName}Descriptor`;
  const descriptorColumnName = `${descriptorName}DescriptorId`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('Documentation')
      .withEndDescriptor()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withDescriptorProperty(descriptorName, 'Documentation', false, true)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(domainEntityIdentityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have identity property', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, domainEntityIdentityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([domainEntityIdentityPropertyName]);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + descriptorName))).toBe(true);
  });

  it('should have descriptor id and identity property', async () => {
    const descriptorIdColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + descriptorName,
      descriptorColumnName,
    );
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);

    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + descriptorName,
      domainEntityIdentityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + descriptorName))).toEqual([
      descriptorColumnName,
      domainEntityIdentityPropertyName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + descriptorName, domainEntityIdentityPropertyName)],
      [column(namespaceName, domainEntityName, domainEntityIdentityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + descriptorName, descriptorColumnName)],
      [column(namespaceName, descriptorTableName, descriptorColumnName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);

    const foreignKey3: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, descriptorColumnName)],
      [column(namespaceName, baseDescriptorTableName, `${baseDescriptorTableName}Id`)],
    );
    expect(await foreignKeyExists(foreignKey3)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey3)).toBe(true);
  });
});

describe('when inline common has domain entity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const inlineCommonName = 'InlineCommonName';
  const referencedDomainEntityName = 'ReferencedDomainEntityName';
  const referencedIdentityPropertyName1 = 'ReferencedIdentityPropertyName1';
  const referencedIdentityPropertyName2 = 'ReferencedIdentityPropertyName2';
  const referencedPropertyName = 'ReferencedPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(referencedDomainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(referencedIdentityPropertyName1, 'Documentation')
      .withIntegerIdentity(referencedIdentityPropertyName2, 'Documentation')
      .withIntegerProperty(referencedPropertyName, 'Documentation', false, false)
      .withEndDomainEntity()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withDomainEntityProperty(referencedDomainEntityName, 'Documentation', false, false)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have referenced and identity properties', async () => {
    const referenceColumn1: DatabaseColumn = column(namespaceName, domainEntityName, referencedIdentityPropertyName1);
    expect(await columnExists(referenceColumn1)).toBe(true);
    expect(await columnIsNullable(referenceColumn1)).toBe(true);

    const referenceColumn2: DatabaseColumn = column(namespaceName, domainEntityName, referencedIdentityPropertyName2);
    expect(await columnExists(referenceColumn2)).toBe(true);
    expect(await columnIsNullable(referenceColumn2)).toBe(true);

    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([identityPropertyName]);
  });

  it('should have referenced domain entity table', async () => {
    expect(await tableExists(table(namespaceName, referencedDomainEntityName))).toBe(true);
  });

  it('should have identity properties', async () => {
    const identityColumn1: DatabaseColumn = column(
      namespaceName,
      referencedDomainEntityName,
      referencedIdentityPropertyName1,
    );
    expect(await columnExists(identityColumn1)).toBe(true);
    expect(await columnIsNullable(identityColumn1)).toBe(false);

    const identityColumn2: DatabaseColumn = column(
      namespaceName,
      referencedDomainEntityName,
      referencedIdentityPropertyName2,
    );
    expect(await columnExists(identityColumn2)).toBe(true);
    expect(await columnIsNullable(identityColumn2)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, referencedDomainEntityName))).toEqual([
      referencedIdentityPropertyName1,
      referencedIdentityPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName, referencedIdentityPropertyName1),
        column(namespaceName, domainEntityName, referencedIdentityPropertyName2),
      ],
      [
        column(namespaceName, referencedDomainEntityName, referencedIdentityPropertyName1),
        column(namespaceName, referencedDomainEntityName, referencedIdentityPropertyName2),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when inline common has collection domain entity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const inlineCommonName = 'InlineCommonName';
  const referencedDomainEntityName = 'ReferencedDomainEntityName';
  const referencedIdentityPropertyName1 = 'ReferencedIdentityPropertyName1';
  const referencedIdentityPropertyName2 = 'ReferencedIdentityPropertyName2';
  const referencedPropertyName = 'ReferencedPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(referencedDomainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(referencedIdentityPropertyName1, 'Documentation')
      .withIntegerIdentity(referencedIdentityPropertyName2, 'Documentation')
      .withIntegerProperty(referencedPropertyName, 'Documentation', false, false)
      .withEndDomainEntity()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withDomainEntityProperty(referencedDomainEntityName, 'Documentation', false, true)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have referenced domain entity table', async () => {
    expect(await tableExists(table(namespaceName, referencedDomainEntityName))).toBe(true);
  });

  it('should have identity properties', async () => {
    const identityColumn1: DatabaseColumn = column(
      namespaceName,
      referencedDomainEntityName,
      referencedIdentityPropertyName1,
    );
    expect(await columnExists(identityColumn1)).toBe(true);
    expect(await columnIsNullable(identityColumn1)).toBe(false);

    const identityColumn2: DatabaseColumn = column(
      namespaceName,
      referencedDomainEntityName,
      referencedIdentityPropertyName2,
    );
    expect(await columnExists(identityColumn2)).toBe(true);
    expect(await columnIsNullable(identityColumn2)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, referencedDomainEntityName))).toEqual([
      referencedIdentityPropertyName1,
      referencedIdentityPropertyName2,
    ]);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + referencedDomainEntityName))).toBe(true);
  });

  it('should have identity properties', async () => {
    const identityColumn1: DatabaseColumn = column(
      namespaceName,
      domainEntityName + referencedDomainEntityName,
      referencedIdentityPropertyName1,
    );
    expect(await columnExists(identityColumn1)).toBe(true);
    expect(await columnIsNullable(identityColumn1)).toBe(false);

    const identityColumn2: DatabaseColumn = column(
      namespaceName,
      domainEntityName + referencedDomainEntityName,
      referencedIdentityPropertyName2,
    );
    expect(await columnExists(identityColumn2)).toBe(true);
    expect(await columnIsNullable(identityColumn2)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + referencedDomainEntityName))).toEqual([
      identityPropertyName,
      referencedIdentityPropertyName1,
      referencedIdentityPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName + referencedDomainEntityName, referencedIdentityPropertyName1),
        column(namespaceName, domainEntityName + referencedDomainEntityName, referencedIdentityPropertyName2),
      ],
      [
        column(namespaceName, referencedDomainEntityName, referencedIdentityPropertyName1),
        column(namespaceName, referencedDomainEntityName, referencedIdentityPropertyName2),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when inline common has inline common property without naming issues', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const inlineCommonName = 'InlineCommonName';
  const nestedInlineCommonName = 'NestedInlineCommonName';
  const nestedOptionalPropertyName = 'NestedOptionalPropertyName';
  const nestedRequiredPropertyName = 'NestedRequiredPropertyName';
  const optionalPropertyName = 'OptionalPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartInlineCommon(nestedInlineCommonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(nestedRequiredPropertyName, 'Documentation', true, false)
      .withIntegerProperty(nestedOptionalPropertyName, 'Documentation', false, false)
      .withEndInlineCommon()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(optionalPropertyName, 'Documentation', false, false)
      .withInlineCommonProperty(nestedInlineCommonName, 'Documentation', false, false)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have inline common and nested inline common properties', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, optionalPropertyName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);

    const nestedRequiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, nestedRequiredPropertyName);
    expect(await columnExists(nestedRequiredColumn)).toBe(true);
    expect(await columnIsNullable(nestedRequiredColumn)).toBe(true);

    const nestedOptionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, nestedOptionalPropertyName);
    expect(await columnExists(nestedOptionalColumn)).toBe(true);
    expect(await columnIsNullable(nestedOptionalColumn)).toBe(true);
  });

  it('should have identity property', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([identityPropertyName]);
  });
});

describe('when inline common has choice property with naming issues', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const choiceName = 'ChoiceName';
  const requiredChoiceProperty1 = 'RequiredChoiceProperty1';
  const requiredChoiceProperty2 = 'RequiredChoiceProperty2';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const inlineCommonName = 'InlineCommonName';
  const inlineCommonPropertyName = 'InlineCommonPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartChoice(choiceName)
      .withDocumentation('Documentation')
      .withIntegerProperty(requiredChoiceProperty1, 'Documentation', true, false)
      .withIntegerProperty(requiredChoiceProperty2, 'Documentation', true, false)
      .withEndChoice()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(inlineCommonPropertyName, 'Documentation', true, false)
      .withChoiceProperty(choiceName, 'Documentation', true, false)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have inline common and choice properties', async () => {
    const requiredColumn1: DatabaseColumn = column(namespaceName, domainEntityName, inlineCommonPropertyName);
    expect(await columnExists(requiredColumn1)).toBe(true);
    expect(await columnIsNullable(requiredColumn1)).toBe(false);

    const requiredChoiceColumn1: DatabaseColumn = column(namespaceName, domainEntityName, requiredChoiceProperty1);
    expect(await columnExists(requiredChoiceColumn1)).toBe(true);
    expect(await columnIsNullable(requiredChoiceColumn1)).toBe(true);

    const requiredChoiceColumn2: DatabaseColumn = column(namespaceName, domainEntityName, requiredChoiceProperty2);
    expect(await columnExists(requiredChoiceColumn2)).toBe(true);
    expect(await columnIsNullable(requiredChoiceColumn2)).toBe(true);
  });

  it('should have identity property', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([identityPropertyName]);
  });
});

describe('when inline common has required common property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const inlineCommonName = 'InlineCommonName';
  const commonName = 'CommonName';
  const commonOptionalPropertyName = 'CommonOptionalPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(commonOptionalPropertyName, 'Documentation', false, false)
      .withEndCommon()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have common join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have common properties', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, commonOptionalPropertyName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have identity property', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName))).toEqual([identityPropertyName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when inline common has collection common property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const commonIdentityPropertyName = 'CommonIdentityPropertyName';
  const commonName = 'CommonName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const inlineCommonName = 'InlineCommonName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(commonIdentityPropertyName, 'Documentation')
      .withEndCommon()

      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withCommonProperty(commonName, 'Documentation', false, true)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have common join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have common property', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, commonIdentityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have identity property', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName))).toEqual([
      commonIdentityPropertyName,
      identityPropertyName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when core inline common is a required property on an extension entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const extension = 'Extension';
  const inlineCommonName = 'InlineCommonName';
  const optionalPropertyContext = 'OptionalPropertyContext';
  const inlinePropertyContext = 'InlinePropertyContext';
  const domainEntityName = 'DomainEntityName';
  const optionalPropertyName = 'OptionalPropertyName';
  const requiredPropertyName = 'RequiredPropertyName';
  const collectionPropertyName = 'CollectionPropertyName';
  const inlineCommonIdentityPropertyName = 'InlineCommonIdentityPropertyName';
  const domainEntityIdentityPropertyName = 'DomainEntityIdentityPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(optionalPropertyName, 'Documentation', false, false)
      .withIntegerProperty(optionalPropertyName, 'Documentation', false, false, null, null, optionalPropertyContext)
      .withIntegerProperty(requiredPropertyName, 'Documentation', true, false)
      .withIntegerProperty(collectionPropertyName, 'Documentation', false, true)
      .withIntegerIdentity(inlineCommonIdentityPropertyName, 'Documentation')
      .withEndInlineCommon()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(domainEntityIdentityPropertyName, 'Documentation')
      .withInlineCommonProperty(`${namespaceName}.${inlineCommonName}`, 'Documentation', true, false)
      .withInlineCommonProperty(`${namespaceName}.${inlineCommonName}`, 'Documentation', true, false, inlinePropertyContext)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(extension, domainEntityName))).toBe(true);
  });

  it('should have domain entity identity', async () => {
    const identityColumn: DatabaseColumn = column(extension, domainEntityName, domainEntityIdentityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have inline common properties', async () => {
    const identityColumn: DatabaseColumn = column(extension, domainEntityName, inlineCommonIdentityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);

    const optionalColumn: DatabaseColumn = column(extension, domainEntityName, optionalPropertyName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);

    const contextColumn: DatabaseColumn = column(
      extension,
      domainEntityName,
      optionalPropertyContext + optionalPropertyName,
    );
    expect(await columnExists(contextColumn)).toBe(true);
    expect(await columnIsNullable(contextColumn)).toBe(true);

    const requiredColumn: DatabaseColumn = column(extension, domainEntityName, requiredPropertyName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
  });

  it('should have inline common properties role name', async () => {
    const identityColumn: DatabaseColumn = column(
      extension,
      domainEntityName,
      inlinePropertyContext + inlineCommonIdentityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);

    const optionalColumn: DatabaseColumn = column(extension, domainEntityName, inlinePropertyContext + optionalPropertyName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);

    const contextColumn: DatabaseColumn = column(
      extension,
      domainEntityName,
      inlinePropertyContext + optionalPropertyContext + optionalPropertyName,
    );
    expect(await columnExists(contextColumn)).toBe(true);
    expect(await columnIsNullable(contextColumn)).toBe(true);

    const requiredColumn: DatabaseColumn = column(extension, domainEntityName, inlinePropertyContext + requiredPropertyName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName))).toEqual([
      domainEntityIdentityPropertyName,
      inlineCommonIdentityPropertyName,
      inlinePropertyContext + inlineCommonIdentityPropertyName,
    ]);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(extension, domainEntityName + collectionPropertyName))).toBe(true);
  });

  it('should have collection property', async () => {
    const collectionColumn: DatabaseColumn = column(
      extension,
      domainEntityName + collectionPropertyName,
      collectionPropertyName,
    );
    expect(await columnExists(collectionColumn)).toBe(true);
    expect(await columnIsNullable(collectionColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName + collectionPropertyName))).toEqual([
      collectionPropertyName,
      domainEntityIdentityPropertyName,
      inlineCommonIdentityPropertyName,
      inlinePropertyContext + inlineCommonIdentityPropertyName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName + collectionPropertyName, domainEntityIdentityPropertyName)],
      [column(extension, domainEntityName, domainEntityIdentityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(extension, domainEntityName + collectionPropertyName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(extension, domainEntityName + collectionPropertyName, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      extension,
      domainEntityName + collectionPropertyName,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });

  it('should have collection table role name', async () => {
    expect(await tableExists(table(extension, domainEntityName + inlinePropertyContext + collectionPropertyName))).toBe(
      true,
    );
  });

  it('should have collection property', async () => {
    const collectionColumn: DatabaseColumn = column(
      extension,
      domainEntityName + collectionPropertyName,
      collectionPropertyName,
    );
    expect(await columnExists(collectionColumn)).toBe(true);
    expect(await columnIsNullable(collectionColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(
      await tablePrimaryKeys(table(extension, domainEntityName + inlinePropertyContext + collectionPropertyName)),
    ).toEqual([
      domainEntityIdentityPropertyName,
      inlineCommonIdentityPropertyName,
      inlinePropertyContext + collectionPropertyName,
      inlinePropertyContext + inlineCommonIdentityPropertyName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(
          extension,
          domainEntityName + inlinePropertyContext + collectionPropertyName,
          domainEntityIdentityPropertyName,
        ),
      ],
      [column(extension, domainEntityName, domainEntityIdentityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(
      extension,
      domainEntityName + inlinePropertyContext + collectionPropertyName,
      'CreateDate',
    );
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(
      extension,
      domainEntityName + inlinePropertyContext + collectionPropertyName,
      'Id',
    );
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      extension,
      domainEntityName + inlinePropertyContext + collectionPropertyName,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });
});
