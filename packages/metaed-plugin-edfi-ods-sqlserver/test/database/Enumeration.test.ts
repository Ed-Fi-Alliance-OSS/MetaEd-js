// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnumerationBuilder, MetaEdTextBuilder, NamespaceBuilder, newMetaEdEnvironment } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  column,
  columnDataTypes,
  enhanceGenerateAndExecuteSql,
  table,
  testTearDown,
  testSuiteAfterAll,
} from './DatabaseTestBase';
import {
  columnDataType,
  columnDefaultConstraint,
  columnExists,
  columnIsIdentity,
  columnIsNullable,
  columnLength,
  columnMSDescription,
} from './DatabaseColumn';
import { tableExists, tablePrimaryKeys } from './DatabaseTable';
import { DatabaseColumn } from './DatabaseColumn';

jest.setTimeout(40000);

afterAll(async () => testSuiteAfterAll());

describe('when enumeration has single item', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const enumerationName = 'EnumerationName';
  const enumerationTableName = `${enumerationName}Type`;
  const enumerationTypeIdColumnName = `${enumerationName}TypeId`;
  const enumerationItemShortDescription = `This is the documentation\nfor the descriptor with 'some' ""special"" --characters--.`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(enumerationName)
      .withDocumentation('Documentation')
      .withEnumerationItem(enumerationItemShortDescription, 'Documentation')
      .withEndEnumeration()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have enumeration table', async () => {
    expect(await tableExists(table(namespaceName, enumerationTableName))).toBe(true);
  });

  it('should have type id column', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, enumerationTableName, enumerationTypeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
    expect(await columnIsIdentity(typeIdColumn)).toBe(true);
    expect(await columnDataType(typeIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(typeIdColumn)).toBe(`Key for ${enumerationName}`);
  });

  it('should have standard descriptor columns', async () => {
    const codeValueColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'CodeValue');
    expect(await columnExists(codeValueColumn)).toBe(true);
    expect(await columnIsNullable(codeValueColumn)).toBe(false);
    expect(await columnDataType(codeValueColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(codeValueColumn)).toBe(50);
    expect(await columnMSDescription(codeValueColumn)).toBe('This column is deprecated.');

    const shortDescriptionColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'ShortDescription');
    expect(await columnExists(shortDescriptionColumn)).toBe(true);
    expect(await columnIsNullable(shortDescriptionColumn)).toBe(false);
    expect(await columnDataType(shortDescriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(shortDescriptionColumn)).toBe(450);
    expect(await columnMSDescription(shortDescriptionColumn)).toBe(`The value for the ${enumerationName} type.`);

    const descriptionColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'Description');
    expect(await columnExists(descriptionColumn)).toBe(true);
    expect(await columnIsNullable(descriptionColumn)).toBe(false);
    expect(await columnDataType(descriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(descriptionColumn)).toBe(1024);
    expect(await columnMSDescription(descriptionColumn)).toBe(`The description for the ${enumerationName} type.`);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, enumerationTableName))).toEqual([enumerationTypeIdColumnName]);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });
});

describe('when enumeration has multiple items', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const enumerationName = 'EnumerationName';
  const enumerationTableName = `${enumerationName}Type`;
  const enumerationTypeIdColumnName = `${enumerationName}TypeId`;
  const shortDescription1 = 'ShortDescription1';
  const shortDescription2 = 'ShortDescription2';
  const shortDescription3 = 'ShortDescription3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(enumerationName)
      .withDocumentation('Documentation')
      .withEnumerationItem(shortDescription1, 'Documentation')
      .withEnumerationItem(shortDescription2, 'Documentation')
      .withEnumerationItem(shortDescription3, 'Documentation')
      .withEndEnumeration()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have enumeration table', async () => {
    expect(await tableExists(table(namespaceName, enumerationTableName))).toBe(true);
  });

  it('should have type id column', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, enumerationTableName, enumerationTypeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
    expect(await columnIsIdentity(typeIdColumn)).toBe(true);
    expect(await columnDataType(typeIdColumn)).toBe(columnDataTypes.integer);
  });

  it('should have standard descriptor columns', async () => {
    const codeValueColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'CodeValue');
    expect(await columnExists(codeValueColumn)).toBe(true);
    expect(await columnIsNullable(codeValueColumn)).toBe(false);
    expect(await columnDataType(codeValueColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(codeValueColumn)).toBe(50);
    expect(await columnMSDescription(codeValueColumn)).toBe('This column is deprecated.');

    const shortDescriptionColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'ShortDescription');
    expect(await columnExists(shortDescriptionColumn)).toBe(true);
    expect(await columnIsNullable(shortDescriptionColumn)).toBe(false);
    expect(await columnDataType(shortDescriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(shortDescriptionColumn)).toBe(450);
    expect(await columnMSDescription(shortDescriptionColumn)).toBe(`The value for the ${enumerationName} type.`);

    const descriptionColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'Description');
    expect(await columnExists(descriptionColumn)).toBe(true);
    expect(await columnIsNullable(descriptionColumn)).toBe(false);
    expect(await columnDataType(descriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(descriptionColumn)).toBe(1024);
    expect(await columnMSDescription(descriptionColumn)).toBe(`The description for the ${enumerationName} type.`);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, enumerationTableName))).toEqual([enumerationTypeIdColumnName]);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });
});

describe('when enumeration name ends in type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const enumerationName = 'EnumerationNameType';
  const enumerationTableName: string = enumerationName;
  const enumerationTypeIdColumnName = `${enumerationName}Id`;
  const shortDescription = 'ShortDescription';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(enumerationName)
      .withDocumentation('Documentation')
      .withEnumerationItem(shortDescription, 'Documentation')
      .withEndEnumeration()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have enumeration table', async () => {
    expect(await tableExists(table(namespaceName, enumerationTableName))).toBe(true);
  });

  it('should have type id column', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, enumerationTableName, enumerationTypeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
    expect(await columnIsIdentity(typeIdColumn)).toBe(true);
    expect(await columnDataType(typeIdColumn)).toBe(columnDataTypes.integer);
  });

  it('should have standard descriptor columns', async () => {
    const codeValueColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'CodeValue');
    expect(await columnExists(codeValueColumn)).toBe(true);
    expect(await columnIsNullable(codeValueColumn)).toBe(false);
    expect(await columnDataType(codeValueColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(codeValueColumn)).toBe(50);
    expect(await columnMSDescription(codeValueColumn)).toBe('This column is deprecated.');

    const shortDescriptionColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'ShortDescription');
    expect(await columnExists(shortDescriptionColumn)).toBe(true);
    expect(await columnIsNullable(shortDescriptionColumn)).toBe(false);
    expect(await columnDataType(shortDescriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(shortDescriptionColumn)).toBe(450);
    expect(await columnMSDescription(shortDescriptionColumn)).toBe(
      `The value for the ${enumerationName.replace(/Type$/g, '')} type.`,
    );

    const descriptionColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'Description');
    expect(await columnExists(descriptionColumn)).toBe(true);
    expect(await columnIsNullable(descriptionColumn)).toBe(false);
    expect(await columnDataType(descriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(descriptionColumn)).toBe(1024);
    expect(await columnMSDescription(descriptionColumn)).toBe(
      `The description for the ${enumerationName.replace(/Type$/g, '')} type.`,
    );
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, enumerationTableName))).toEqual([enumerationTypeIdColumnName]);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, enumerationTableName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });
});

describe('when extension enumeration has single item', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const extension = 'Extension';
  const enumerationName2 = 'EnumerationName2';
  const enumerationTableName2 = `${enumerationName2}Type`;
  const enumerationTypeIdColumnName2 = `${enumerationName2}TypeId`;
  const enumerationItemShortDescription2 = `This is the documentation\nfor the descriptor with 'some' ""special"" --characters--.`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration('EnumerationName1')
      .withDocumentation('Documentation')
      .withEnumerationItem('EnumerationItemShortDescription1', 'Documentation')
      .withEndEnumeration()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartEnumeration(enumerationName2)
      .withDocumentation('Documentation')
      .withEnumerationItem(enumerationItemShortDescription2, 'Documentation')
      .withEndEnumeration()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have enumeration table', async () => {
    expect(await tableExists(table(extension, enumerationTableName2))).toBe(true);
  });

  it('should have type id column', async () => {
    const typeIdColumn: DatabaseColumn = column(extension, enumerationTableName2, enumerationTypeIdColumnName2);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
    expect(await columnIsIdentity(typeIdColumn)).toBe(true);
    expect(await columnDataType(typeIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(typeIdColumn)).toBe(`Key for ${enumerationName2}`);
  });

  it('should have standard descriptor columns', async () => {
    const codeValueColumn: DatabaseColumn = column(extension, enumerationTableName2, 'CodeValue');
    expect(await columnExists(codeValueColumn)).toBe(true);
    expect(await columnIsNullable(codeValueColumn)).toBe(false);
    expect(await columnDataType(codeValueColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(codeValueColumn)).toBe(50);
    expect(await columnMSDescription(codeValueColumn)).toBe('This column is deprecated.');

    const shortDescriptionColumn: DatabaseColumn = column(extension, enumerationTableName2, 'ShortDescription');
    expect(await columnExists(shortDescriptionColumn)).toBe(true);
    expect(await columnIsNullable(shortDescriptionColumn)).toBe(false);
    expect(await columnDataType(shortDescriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(shortDescriptionColumn)).toBe(450);
    expect(await columnMSDescription(shortDescriptionColumn)).toBe(`The value for the ${enumerationName2} type.`);

    const descriptionColumn: DatabaseColumn = column(extension, enumerationTableName2, 'Description');
    expect(await columnExists(descriptionColumn)).toBe(true);
    expect(await columnIsNullable(descriptionColumn)).toBe(false);
    expect(await columnDataType(descriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(descriptionColumn)).toBe(1024);
    expect(await columnMSDescription(descriptionColumn)).toBe(`The description for the ${enumerationName2} type.`);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(extension, enumerationTableName2))).toEqual([enumerationTypeIdColumnName2]);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(extension, enumerationTableName2, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(extension, enumerationTableName2, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(extension, enumerationTableName2, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });
});
