// @flow
import {
  DescriptorBuilder,
  DomainEntityBuilder,
  EnumerationBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
} from 'metaed-core';
import type { MetaEdEnvironment, Namespace } from 'metaed-core';
import { column, columnDataTypes, enhanceGenerateAndExecuteSql, foreignKey, table, testTearDown } from './DatabaseTestBase';
import {
  columnDataType,
  columnDefaultConstraint,
  columnExists,
  columnFirstRowValue,
  columnIsIdentity,
  columnIsNullable,
  columnLength,
  columnMSDescription,
  columnNthRowValue,
} from './DatabaseColumn';
import { foreignKeyDeleteCascades, foreignKeyExists } from './DatabaseForeignKey';
import {
  tableColumnCount,
  tableExists,
  tableMSDescription,
  tablePrimaryKeys,
  tableRowCount,
  tableUniqueConstraints,
} from './DatabaseTable';
import type { DatabaseColumn } from './DatabaseColumn';
import type { DatabaseForeignKey } from './DatabaseForeignKey';
import type { DatabaseTable } from './DatabaseTable';

jest.setTimeout(40000);

describe('when descriptor is defined', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = 'Descriptor';
  const descriptorName: string = 'DescriptorName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('Documentation')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have base descriptor table', async () => {
    expect(await tableExists(table(namespaceName, baseDescriptorTableName))).toBe(true);
  });

  it('should have table documentation', async () => {
    expect(await tableMSDescription(table(namespaceName, baseDescriptorTableName))).toBe(
      'This is the base entity for the descriptor pattern.',
    );
  });

  it('should have standard descriptor columns', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, baseDescriptorTableName, 'DescriptorId');
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
    expect(await columnDataType(descriptorIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnIsIdentity(descriptorIdColumn)).toBe(true);
    expect(await columnMSDescription(descriptorIdColumn)).toBe(
      'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    );

    const namespaceColumn: DatabaseColumn = column(namespaceName, baseDescriptorTableName, 'Namespace');
    expect(await columnExists(namespaceColumn)).toBe(true);
    expect(await columnIsNullable(namespaceColumn)).toBe(false);
    expect(await columnDataType(namespaceColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(namespaceColumn)).toBe(255);
    expect(await columnMSDescription(namespaceColumn)).toBe(
      'A globally unique namespace that identifies this descriptor set. Author is strongly encouraged to use the Universal Resource Identifier (http, ftp, file, etc.) for the source of the descriptor definition. Best practice is for this source to be the descriptor file itself, so that it can be machine-readable and be fetched in real-time, if necessary.',
    );

    const codeValueColumn: DatabaseColumn = column(namespaceName, baseDescriptorTableName, 'CodeValue');
    expect(await columnExists(codeValueColumn)).toBe(true);
    expect(await columnIsNullable(codeValueColumn)).toBe(false);
    expect(await columnDataType(codeValueColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(codeValueColumn)).toBe(50);
    expect(await columnMSDescription(codeValueColumn)).toBe(
      'A code or abbreviation that is used to refer to the descriptor.',
    );

    const shortDescriptionColumn: DatabaseColumn = column(namespaceName, baseDescriptorTableName, 'ShortDescription');
    expect(await columnExists(shortDescriptionColumn)).toBe(true);
    expect(await columnIsNullable(shortDescriptionColumn)).toBe(false);
    expect(await columnDataType(shortDescriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(shortDescriptionColumn)).toBe(75);
    expect(await columnMSDescription(shortDescriptionColumn)).toBe('A shortened description for the descriptor.');

    const descriptionColumn: DatabaseColumn = column(namespaceName, baseDescriptorTableName, 'Description');
    expect(await columnExists(descriptionColumn)).toBe(true);
    expect(await columnIsNullable(descriptionColumn)).toBe(true);
    expect(await columnDataType(descriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(descriptionColumn)).toBe(1024);
    expect(await columnMSDescription(descriptionColumn)).toBe('The description of the descriptor.');

    const priorDescriptorIdColumn: DatabaseColumn = column(namespaceName, baseDescriptorTableName, 'PriorDescriptorId');
    expect(await columnExists(priorDescriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(priorDescriptorIdColumn)).toBe(true);
    expect(await columnDataType(priorDescriptorIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(priorDescriptorIdColumn)).toBe(
      'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    );

    const effectiveBeginDateColumn: DatabaseColumn = column(namespaceName, baseDescriptorTableName, 'EffectiveBeginDate');
    expect(await columnExists(effectiveBeginDateColumn)).toBe(true);
    expect(await columnIsNullable(effectiveBeginDateColumn)).toBe(true);
    expect(await columnDataType(effectiveBeginDateColumn)).toBe(columnDataTypes.date);
    expect(await columnMSDescription(effectiveBeginDateColumn)).toBe(
      'The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness.',
    );

    const effectiveEndDateColumn: DatabaseColumn = column(namespaceName, baseDescriptorTableName, 'EffectiveEndDate');
    expect(await columnExists(effectiveEndDateColumn)).toBe(true);
    expect(await columnIsNullable(effectiveEndDateColumn)).toBe(true);
    expect(await columnDataType(effectiveEndDateColumn)).toBe(columnDataTypes.date);
    expect(await columnMSDescription(effectiveEndDateColumn)).toBe(
      'The end date of the period when the descriptor is in effect.',
    );
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, baseDescriptorTableName))).toEqual(['DescriptorId']);
  });

  it('should have alternate keys', async () => {
    expect(await tableUniqueConstraints(table(namespaceName, baseDescriptorTableName))).toEqual(['CodeValue', 'Namespace']);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, baseDescriptorTableName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, baseDescriptorTableName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, baseDescriptorTableName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });
});

describe('when descriptor does not have a map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = `Descriptor`;
  const descriptorDocumentation: string = `This is the documentation\nfor the descriptor with 'some' ""special"" --characters--.`;
  const descriptorName: string = 'DescriptorName';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const descriptorIdColumnName: string = `${descriptorTableName}Id`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation(descriptorDocumentation)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table', async () => {
    expect(await tableExists(table(namespaceName, descriptorTableName))).toBe(true);
  });

  it('should have table documentation', async () => {
    expect(await tableMSDescription(table(namespaceName, descriptorTableName))).toBe(
      descriptorDocumentation.replace(/""/g, '"'),
    );
  });

  it('should have descriptor id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
    expect(await columnDataType(descriptorIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(descriptorIdColumn)).toBe(
      'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    );
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName))).toEqual([descriptorIdColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, descriptorIdColumnName)],
      [column(namespaceName, baseDescriptorTableName, `${baseDescriptorTableName}Id`)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should not have map type table', async () => {
    expect(await tableExists(table(namespaceName, `${descriptorName}Type`))).toBe(false);
  });

  it('should not have map type foreign key column', async () => {
    expect(await columnExists(column(namespaceName, descriptorTableName, `${baseDescriptorTableName}TypeId`))).toBe(false);
    expect(await tableColumnCount(table(namespaceName, descriptorTableName))).toBe(1);
  });
});

describe('when descriptor has required map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = `Descriptor`;
  const descriptorDocumentation: string = 'DescriptorDocumentation';
  const descriptorName: string = 'DescriptorName';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const descriptorIdColumnName: string = `${descriptorTableName}Id`;
  const mapTypeDocumentation: string = `MapTypeDocumentation`;
  const mapTypeShortDescription: string = `This is the documentation\nfor the descriptor with 'some' ""special"" --characters--.`;
  const typeTableName: string = `${descriptorName}Type`;
  const typeIdColumnName: string = `${descriptorName}TypeId`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation(descriptorDocumentation)
      .withStartMapType(true)
      .withDocumentation(mapTypeDocumentation)
      .withEnumerationItem(mapTypeShortDescription, 'Documentation')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table', async () => {
    expect(await tableExists(table(namespaceName, descriptorTableName))).toBe(true);
  });

  it('should have table documentation', async () => {
    expect(await tableMSDescription(table(namespaceName, descriptorTableName))).toBe(
      descriptorDocumentation.replace(/""/g, '"'),
    );
  });

  it('should have descriptor and type id columns', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
    expect(await columnIsIdentity(descriptorIdColumn)).toBe(false);
    expect(await columnDataType(descriptorIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(descriptorIdColumn)).toBe(
      'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    );

    const typeIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, typeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
    expect(await columnDataType(typeIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(typeIdColumn)).toBe(
      'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    );
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName))).toEqual([descriptorIdColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, descriptorIdColumnName)],
      [column(namespaceName, baseDescriptorTableName, `${baseDescriptorTableName}Id`)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have map type table', async () => {
    expect(await tableExists(table(namespaceName, typeTableName))).toBe(true);
  });

  it('should have table documentation', async () => {
    expect(await tableMSDescription(table(namespaceName, typeTableName))).toBe(mapTypeDocumentation.replace(/""/g, '"'));
  });

  it('should have type id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, typeTableName, typeIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
    expect(await columnIsIdentity(descriptorIdColumn)).toBe(true);
    expect(await columnDataType(descriptorIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(descriptorIdColumn)).toBe(`Key for ${descriptorName}`);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, typeTableName))).toEqual([typeIdColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, typeIdColumnName)],
      [column(namespaceName, typeTableName, typeIdColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });

  it('should have standard descriptor columns', async () => {
    const codeValueColumn: DatabaseColumn = column(namespaceName, typeTableName, 'CodeValue');
    expect(await columnExists(codeValueColumn)).toBe(true);
    expect(await columnIsNullable(codeValueColumn)).toBe(false);
    expect(await columnDataType(codeValueColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(codeValueColumn)).toBe(50);
    expect(await columnMSDescription(codeValueColumn)).toBe('This column is deprecated.');
    expect(await columnFirstRowValue(codeValueColumn)).toBe('');

    const shortDescriptionColumn: DatabaseColumn = column(namespaceName, typeTableName, 'ShortDescription');
    expect(await columnExists(shortDescriptionColumn)).toBe(true);
    expect(await columnIsNullable(shortDescriptionColumn)).toBe(false);
    expect(await columnDataType(shortDescriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(shortDescriptionColumn)).toBe(450);
    expect(await columnMSDescription(shortDescriptionColumn)).toBe(`The value for the ${descriptorName} type.`);
    expect(await columnFirstRowValue(shortDescriptionColumn)).toBe(mapTypeShortDescription.replace(/""/g, '"'));

    const descriptionColumn: DatabaseColumn = column(namespaceName, typeTableName, 'Description');
    expect(await columnExists(descriptionColumn)).toBe(true);
    expect(await columnIsNullable(descriptionColumn)).toBe(false);
    expect(await columnDataType(descriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(descriptionColumn)).toBe(1024);
    expect(await columnMSDescription(descriptionColumn)).toBe(`The description for the ${descriptorName} type.`);
    expect(await columnFirstRowValue(descriptionColumn)).toBe(mapTypeShortDescription.replace(/""/g, '"'));
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, typeTableName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, typeTableName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, typeTableName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });
});

describe('when descriptor has required map type with multiple items', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const descriptorDocumentation: string = 'DescriptorDocumentation';
  const descriptorName: string = 'DescriptorName';
  const mapTypeDocumentation: string = `MapTypeDocumentation`;
  const mapTypeShortDescription1: string = 'MapTypeShortDescription1';
  const mapTypeShortDescription2: string = 'MapTypeShortDescription2';
  const mapTypeShortDescription3: string = 'MapTypeShortDescription3';
  const typeTableName: string = `${descriptorName}Type`;
  const typeIdColumnName: string = `${descriptorName}TypeId`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation(descriptorDocumentation)
      .withStartMapType(true)
      .withDocumentation(mapTypeDocumentation)
      .withEnumerationItem(mapTypeShortDescription1, 'Documentation')
      .withEnumerationItem(mapTypeShortDescription2, 'Documentation')
      .withEnumerationItem(mapTypeShortDescription3, 'Documentation')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have map type table', async () => {
    expect(await tableExists(table(namespaceName, typeTableName))).toBe(true);
  });

  it('should have three rows', async () => {
    expect(await tableRowCount(table(namespaceName, typeTableName))).toBe(3);
  });

  it('should have blank code value', async () => {
    const codeValueColumn: DatabaseColumn = column(namespaceName, typeTableName, 'CodeValue');
    expect(await columnExists(codeValueColumn)).toBe(true);
    expect(await columnFirstRowValue(codeValueColumn)).toBe('');
    expect(await columnNthRowValue(codeValueColumn, typeIdColumnName, '2')).toBe('');
    expect(await columnNthRowValue(codeValueColumn, typeIdColumnName, '3')).toBe('');

    const descriptionColumn: DatabaseColumn = column(namespaceName, typeTableName, 'Description');
    expect(await columnExists(descriptionColumn)).toBe(true);
    expect(await columnFirstRowValue(descriptionColumn)).toBe(mapTypeShortDescription1);
    expect(await columnNthRowValue(descriptionColumn, typeIdColumnName, '2')).toBe(mapTypeShortDescription2);
    expect(await columnNthRowValue(descriptionColumn, typeIdColumnName, '3')).toBe(mapTypeShortDescription3);

    const shortDescriptionColumn: DatabaseColumn = column(namespaceName, typeTableName, 'ShortDescription');
    expect(await columnExists(shortDescriptionColumn)).toBe(true);
    expect(await columnFirstRowValue(shortDescriptionColumn)).toBe(mapTypeShortDescription1);
    expect(await columnNthRowValue(shortDescriptionColumn, typeIdColumnName, '2')).toBe(mapTypeShortDescription2);
    expect(await columnNthRowValue(shortDescriptionColumn, typeIdColumnName, '3')).toBe(mapTypeShortDescription3);
  });
});

describe('when descriptor has optional map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = `Descriptor`;
  const descriptorName: string = 'DescriptorName';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const typeTableName: string = `${descriptorName}Type`;
  const typeIdColumnName: string = `${descriptorName}TypeId`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('DescriptorDocumentation')
      .withStartMapType(false)
      .withDocumentation(`MapTypeDocumentation`)
      .withEnumerationItem('MapTypeShortDescription', 'Documentation')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table', async () => {
    expect(await tableExists(table(namespaceName, descriptorTableName))).toBe(true);
  });

  it('should have type id column', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, typeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(true);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, typeIdColumnName)],
      [column(namespaceName, typeTableName, typeIdColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when descriptor name has type suffix', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = `Descriptor`;
  const descriptorDocumentation: string = 'DescriptorDocumentation';
  const descriptorName: string = 'DescriptorNameType';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const descriptorIdColumnName: string = `${descriptorTableName}Id`;
  const mapTypeDocumentation: string = `MapTypeDocumentation`;
  const mapTypeShortDescription: string = 'MapTypeShortDescription1';
  const typeTableName: string = descriptorName;
  const typeIdColumnName: string = `${descriptorName}Id`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation(descriptorDocumentation)
      .withStartMapType()
      .withDocumentation(mapTypeDocumentation)
      .withEnumerationItem(mapTypeShortDescription, 'Documentation')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table', async () => {
    expect(await tableExists(table(namespaceName, descriptorTableName))).toBe(true);
  });

  it('should have descriptor id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName))).toEqual([descriptorIdColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, descriptorIdColumnName)],
      [column(namespaceName, baseDescriptorTableName, `${baseDescriptorTableName}Id`)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, typeIdColumnName)],
      [column(namespaceName, typeTableName, typeIdColumnName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);
  });
});

describe('when descriptor has properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = `Descriptor`;
  const descriptorDocumentation: string = 'DescriptorDocumentation';
  const descriptorName: string = 'DescriptorName';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const descriptorIdColumnName: string = `${descriptorTableName}Id`;
  const typeTableName: string = `${descriptorName}Type`;
  const typeIdColumnName: string = `${descriptorName}TypeId`;
  const stringPropertyName1: string = 'StringPropertyName1';
  const stringPropertyName2: string = 'StringPropertyName2';
  const stringPropertyDocumentation1: string = 'StringPropertyDocumentation1';
  const stringPropertyDocumentation2: string = 'StringPropertyDocumentation2';
  const maxLength: string = '128';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation(descriptorDocumentation)
      .withStringProperty(stringPropertyName1, stringPropertyDocumentation1, false, false, maxLength)
      .withStringProperty(stringPropertyName2, stringPropertyDocumentation2, true, false, maxLength)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, descriptorTableName);
    expect(await tableExists(descriptorTable)).toBe(true);
    expect(await tableColumnCount(descriptorTable)).toBe(3);
  });

  it('should have descriptor id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
    expect(await columnIsIdentity(descriptorIdColumn)).toBe(false);
  });

  it('should have property columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, descriptorTableName, stringPropertyName1);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnMSDescription(optionalColumn)).toBe(stringPropertyDocumentation1);

    const requiredColumn: DatabaseColumn = column(namespaceName, descriptorTableName, stringPropertyName2);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnMSDescription(requiredColumn)).toBe(stringPropertyDocumentation2);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName))).toEqual([descriptorIdColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, descriptorIdColumnName)],
      [column(namespaceName, baseDescriptorTableName, `${baseDescriptorTableName}Id`)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should not have map type table', async () => {
    const typeTable: DatabaseTable = table(namespaceName, typeTableName);
    expect(await tableExists(typeTable)).toBe(false);
  });

  it('should not have map type id column', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, typeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(false);
  });
});

describe('when descriptor has properties and map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = `Descriptor`;
  const descriptorName: string = 'DescriptorName';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const descriptorIdColumnName: string = `${descriptorTableName}Id`;
  const stringPropertyDocumentation1: string = 'StringPropertyDocumentation1';
  const stringPropertyDocumentation2: string = 'StringPropertyDocumentation2';
  const stringPropertyName1: string = 'StringPropertyName1';
  const stringPropertyName2: string = 'StringPropertyName2';
  const typeIdColumnName: string = `${descriptorName}TypeId`;
  const typeTableName: string = `${descriptorName}Type`;
  const maxLength: string = '128';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('DescriptorDocumentation')
      .withStringProperty(stringPropertyName1, stringPropertyDocumentation1, false, false, maxLength)
      .withStringProperty(stringPropertyName2, stringPropertyDocumentation2, true, false, maxLength)
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem('MapTypeShortDescription', 'Documentation')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, descriptorTableName);
    expect(await tableExists(descriptorTable)).toBe(true);
    expect(await tableColumnCount(descriptorTable)).toBe(4);
  });

  it('should have type id column', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, typeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
  });

  it('should have property columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, descriptorTableName, stringPropertyName1);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnMSDescription(optionalColumn)).toBe(stringPropertyDocumentation1);

    const requiredColumn: DatabaseColumn = column(namespaceName, descriptorTableName, stringPropertyName2);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnMSDescription(requiredColumn)).toBe(stringPropertyDocumentation2);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName))).toEqual([descriptorIdColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, descriptorIdColumnName)],
      [column(namespaceName, baseDescriptorTableName, `${baseDescriptorTableName}Id`)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have map type table', async () => {
    const typeTable: DatabaseTable = table(namespaceName, typeTableName);
    expect(await tableExists(typeTable)).toBe(true);
  });
});

describe('when descriptor has required collection property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = `Descriptor`;
  const descriptorName: string = 'DescriptorName';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const descriptorIdColumnName: string = `${descriptorTableName}Id`;
  const stringPropertyDocumentation: string = 'StringPropertyDocumentation';
  const stringPropertyName: string = 'StringPropertyName';
  const typeIdColumnName: string = `${descriptorName}TypeId`;
  const typeTableName: string = `${descriptorName}Type`;
  const maxLength: string = '128';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('DescriptorDocumentation')
      .withStringProperty(stringPropertyName, stringPropertyDocumentation, true, true, maxLength)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, descriptorTableName);
    expect(await tableExists(descriptorTable)).toBe(true);
    expect(await tableColumnCount(descriptorTable)).toBe(1);
  });

  it('should have descriptor id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName))).toEqual([descriptorIdColumnName]);
  });

  it('should have collection table', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, descriptorTableName + stringPropertyName);
    expect(await tableExists(descriptorTable)).toBe(true);
    expect(await tableColumnCount(descriptorTable)).toBe(3);
  });

  it('should have descriptor id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(
      namespaceName,
      descriptorTableName + stringPropertyName,
      descriptorIdColumnName,
    );
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
  });

  it('should have property column', async () => {
    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      descriptorTableName + stringPropertyName,
      stringPropertyName,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnMSDescription(requiredColumn)).toBe(stringPropertyDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName + stringPropertyName))).toEqual([
      descriptorIdColumnName,
      stringPropertyName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName + stringPropertyName, descriptorIdColumnName)],
      [column(namespaceName, descriptorTableName, descriptorIdColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(namespaceName, descriptorTableName + stringPropertyName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, descriptorTableName + stringPropertyName, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      namespaceName,
      descriptorTableName + stringPropertyName,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });

  it('should not have map type table', async () => {
    const typeTable: DatabaseTable = table(namespaceName, typeTableName);
    expect(await tableExists(typeTable)).toBe(false);
  });

  it('should not have map type id column', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, typeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(false);
  });
});

describe('when descriptor has optional collection property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = `Descriptor`;
  const descriptorName: string = 'DescriptorName';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const descriptorIdColumnName: string = `${descriptorTableName}Id`;
  const stringPropertyDocumentation: string = 'StringPropertyDocumentation';
  const stringPropertyName: string = 'StringPropertyName';
  const typeIdColumnName: string = `${descriptorName}TypeId`;
  const typeTableName: string = `${descriptorName}Type`;
  const maxLength: string = '128';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('DescriptorDocumentation')
      .withStringProperty(stringPropertyName, stringPropertyDocumentation, false, true, maxLength)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, descriptorTableName);
    expect(await tableExists(descriptorTable)).toBe(true);
    expect(await tableColumnCount(descriptorTable)).toBe(1);
  });

  it('should have descriptor id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName))).toEqual([descriptorIdColumnName]);
  });

  it('should have collection table', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, descriptorTableName + stringPropertyName);
    expect(await tableExists(descriptorTable)).toBe(true);
    expect(await tableColumnCount(descriptorTable)).toBe(3);
  });

  it('should have descriptor id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(
      namespaceName,
      descriptorTableName + stringPropertyName,
      descriptorIdColumnName,
    );
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
  });

  it('should have property column', async () => {
    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      descriptorTableName + stringPropertyName,
      stringPropertyName,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnMSDescription(requiredColumn)).toBe(stringPropertyDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName + stringPropertyName))).toEqual([
      descriptorIdColumnName,
      stringPropertyName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName + stringPropertyName, descriptorIdColumnName)],
      [column(namespaceName, descriptorTableName, descriptorIdColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(namespaceName, descriptorTableName + stringPropertyName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, descriptorTableName + stringPropertyName, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      namespaceName,
      descriptorTableName + stringPropertyName,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });

  it('should not have map type table', async () => {
    const typeTable: DatabaseTable = table(namespaceName, typeTableName);
    expect(await tableExists(typeTable)).toBe(false);
  });

  it('should not have map type id column', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, typeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(false);
  });
});

describe('when descriptor has enumeration property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = `Descriptor`;
  const descriptorName: string = 'DescriptorName';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const descriptorIdColumnName: string = `${descriptorTableName}Id`;
  const enumerationName: string = 'EnumerationName';
  const enumerationPropertyDocumentation: string = 'EnumerationPropertyDocumentation';
  const typeIdColumnName: string = `${enumerationName}TypeId`;
  const typeTableName: string = `${enumerationName}Type`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(enumerationName)
      .withEnumerationItem('EnumerationItemName')
      .withEndEnumeration()

      .withStartDescriptor(descriptorName)
      .withDocumentation('DescriptorDocumentation')
      .withEnumerationProperty(enumerationName, enumerationPropertyDocumentation, false, false)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, descriptorTableName);
    expect(await tableExists(descriptorTable)).toBe(true);
    expect(await tableColumnCount(descriptorTable)).toBe(2);
  });

  it('should have descriptor id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
  });

  it('should have type id column', async () => {
    const typeIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, typeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(true);
    expect(await columnDataType(typeIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(typeIdColumn)).toBe(enumerationPropertyDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName))).toEqual([descriptorIdColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, typeIdColumnName)],
      [column(namespaceName, typeTableName, typeIdColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when descriptor has descriptor property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = `Descriptor`;
  const referencedDescriptorName: string = 'ReferencedDescriptorName';
  const descriptorName: string = 'DescriptorName';
  const descriptorPropertyDocumentation: string = 'DescriptorPropertyDocumentation';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const descriptorIdColumnName: string = `${descriptorTableName}Id`;
  const referencedDescriptorTableName: string = referencedDescriptorName + baseDescriptorTableName;
  const referencedDescriptorIdColumnName: string = `${referencedDescriptorTableName}Id`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(referencedDescriptorName)
      .withDocumentation('ReferencedDescriptorDocumentation')
      .withEndDescriptor()

      .withStartDescriptor(descriptorName)
      .withDocumentation('DescriptorDocumentation2')
      .withDescriptorProperty(referencedDescriptorName, descriptorPropertyDocumentation, false, false)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, descriptorTableName);
    expect(await tableExists(descriptorTable)).toBe(true);
    expect(await tableColumnCount(descriptorTable)).toBe(2);
  });

  it('should have descriptor id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
  });

  it('should have referenced descriptor id column', async () => {
    const referencedDescriptorIdColumn: DatabaseColumn = column(
      namespaceName,
      descriptorTableName,
      referencedDescriptorIdColumnName,
    );
    expect(await columnExists(referencedDescriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(referencedDescriptorIdColumn)).toBe(true);
    expect(await columnDataType(referencedDescriptorIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(referencedDescriptorIdColumn)).toBe(descriptorPropertyDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName))).toEqual([descriptorIdColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName, referencedDescriptorIdColumnName)],
      [column(namespaceName, referencedDescriptorTableName, referencedDescriptorIdColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when descriptor has collection descriptor property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const baseDescriptorTableName: string = `Descriptor`;
  const descriptorName: string = 'DescriptorName';
  const descriptorPropertyDocumentation: string = 'DescriptorPropertyDocumentation';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const descriptorIdColumnName: string = `${descriptorTableName}Id`;
  const referencedDescriptorName: string = 'ReferencedDescriptorName';
  const referencedDescriptorTableName: string = referencedDescriptorName + baseDescriptorTableName;
  const referencedDescriptorIdColumnName: string = `${referencedDescriptorTableName}Id`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(referencedDescriptorName)
      .withDocumentation('ReferencedDescriptorDocumentation')
      .withEndDescriptor()

      .withStartDescriptor(descriptorName)
      .withDocumentation('DescriptorDocumentation2')
      .withDescriptorProperty(referencedDescriptorName, descriptorPropertyDocumentation, false, true)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, descriptorTableName);
    expect(await tableExists(descriptorTable)).toBe(true);
    expect(await tableColumnCount(descriptorTable)).toBe(1);
  });

  it('should have descriptor id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, descriptorTableName, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName))).toEqual([descriptorIdColumnName]);
  });

  it('should have collection table', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, descriptorTableName + referencedDescriptorName);
    expect(await tableExists(descriptorTable)).toBe(true);
    expect(await tableColumnCount(descriptorTable)).toBe(3);
  });

  it('should have descriptor id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(
      namespaceName,
      descriptorTableName + referencedDescriptorName,
      descriptorIdColumnName,
    );
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
  });

  it('should have property column', async () => {
    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      descriptorTableName + referencedDescriptorName,
      referencedDescriptorIdColumnName,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(requiredColumn)).toBe(descriptorPropertyDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, descriptorTableName + referencedDescriptorName))).toEqual([
      descriptorIdColumnName,
      referencedDescriptorIdColumnName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, descriptorTableName + referencedDescriptorName, descriptorIdColumnName)],
      [column(namespaceName, descriptorTableName, descriptorIdColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(
      namespaceName,
      descriptorTableName + referencedDescriptorName,
      'CreateDate',
    );
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, descriptorTableName + referencedDescriptorName, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      namespaceName,
      descriptorTableName + referencedDescriptorName,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });
});

describe('when extension descriptor has required reference properties to core entity and map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const extension: string = 'extension';
  const baseDescriptorTableName: string = `Descriptor`;
  const descriptorName: string = 'DescriptorName';
  const descriptorTableName: string = descriptorName + baseDescriptorTableName;
  const descriptorIdColumnName: string = `${descriptorTableName}Id`;
  const domainEntityName: string = 'DomainEntityName';
  const integerPropertyName: string = 'IntegerPropertyName';
  const integerPropertyDocumentation: string = 'IntegerPropertyDocumentation';
  const typeIdColumnName: string = `${descriptorName}TypeId`;
  const typeTableName: string = `${descriptorName}Type`;
  const mapTypeShortDescription: string = 'MapTypeShortDescription';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, integerPropertyDocumentation)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDescriptor(descriptorName)
      .withDocumentation('DescriptorDocumentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', true, false)
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem(mapTypeShortDescription, 'Documentation')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    const coreNamespace: ?Namespace = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: ?Namespace = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have descriptor table in extension', async () => {
    const descriptorTable: DatabaseTable = table(extension, descriptorTableName);
    expect(await tableExists(descriptorTable)).toBe(true);
    expect(await tableColumnCount(descriptorTable)).toBe(3);
  });

  it('should not have descriptor table in core', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, descriptorTableName);
    expect(await tableExists(descriptorTable)).toBe(false);
  });

  it('should have descriptor id and type id column', async () => {
    const descriptorIdColumn: DatabaseColumn = column(extension, descriptorTableName, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);
    expect(await columnIsIdentity(descriptorIdColumn)).toBe(false);
    expect(await columnDataType(descriptorIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(descriptorIdColumn)).toBe(
      'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    );

    const typeIdColumn: DatabaseColumn = column(extension, descriptorTableName, typeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
    expect(await columnIsIdentity(typeIdColumn)).toBe(false);
    expect(await columnDataType(typeIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(typeIdColumn)).toBe(
      'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    );
  });

  it('should have property columns', async () => {
    const requiredColumn: DatabaseColumn = column(extension, descriptorTableName, integerPropertyName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(requiredColumn)).toBe(integerPropertyDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, descriptorTableName))).toEqual([descriptorIdColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, descriptorTableName, descriptorIdColumnName)],
      [column(namespaceName, baseDescriptorTableName, `${baseDescriptorTableName}Id`)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(extension, descriptorTableName, typeIdColumnName)],
      [column(extension, typeTableName, typeIdColumnName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);
  });

  it('should have map type table in extension', async () => {
    const typeTable: DatabaseTable = table(extension, typeTableName);
    expect(await tableExists(typeTable)).toBe(true);
  });

  it('should not have descriptor table in core', async () => {
    const descriptorTable: DatabaseTable = table(namespaceName, typeTableName);
    expect(await tableExists(descriptorTable)).toBe(false);
  });

  it('should have type id column', async () => {
    const typeIdColumn: DatabaseColumn = column(extension, typeTableName, typeIdColumnName);
    expect(await columnExists(typeIdColumn)).toBe(true);
    expect(await columnIsNullable(typeIdColumn)).toBe(false);
    expect(await columnIsIdentity(typeIdColumn)).toBe(true);
    expect(await columnDataType(typeIdColumn)).toBe(columnDataTypes.integer);
    expect(await columnMSDescription(typeIdColumn)).toBe(`Key for ${descriptorName}`);
  });

  it('should have standard descriptor columns', async () => {
    const codeValueColumn: DatabaseColumn = column(extension, typeTableName, 'CodeValue');
    expect(await columnExists(codeValueColumn)).toBe(true);
    expect(await columnIsNullable(codeValueColumn)).toBe(false);
    expect(await columnDataType(codeValueColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(codeValueColumn)).toBe(50);
    expect(await columnMSDescription(codeValueColumn)).toBe('This column is deprecated.');
    expect(await columnFirstRowValue(codeValueColumn)).toBe('');

    const shortDescriptionColumn: DatabaseColumn = column(extension, typeTableName, 'ShortDescription');
    expect(await columnExists(shortDescriptionColumn)).toBe(true);
    expect(await columnIsNullable(shortDescriptionColumn)).toBe(false);
    expect(await columnDataType(shortDescriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(shortDescriptionColumn)).toBe(450);
    expect(await columnMSDescription(shortDescriptionColumn)).toBe(`The value for the ${descriptorName} type.`);
    expect(await columnFirstRowValue(shortDescriptionColumn)).toBe(mapTypeShortDescription.replace(/""/g, '"'));

    const descriptionColumn: DatabaseColumn = column(extension, typeTableName, 'Description');
    expect(await columnExists(descriptionColumn)).toBe(true);
    expect(await columnIsNullable(descriptionColumn)).toBe(false);
    expect(await columnDataType(descriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(descriptionColumn)).toBe(1024);
    expect(await columnMSDescription(descriptionColumn)).toBe(`The description for the ${descriptorName} type.`);
    expect(await columnFirstRowValue(descriptionColumn)).toBe(mapTypeShortDescription.replace(/""/g, '"'));
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(extension, typeTableName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(extension, typeTableName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(extension, typeTableName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });
});
