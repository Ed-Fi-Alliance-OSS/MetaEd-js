// @flow
import {
  DomainEntityBuilder,
  ChoiceBuilder,
  CommonBuilder,
  DescriptorBuilder,
  EnumerationBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
} from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { column, enhanceGenerateAndExecuteSql, foreignKey, table, testTearDown, columnDataTypes } from './DatabaseTestBase';
import { columnExists, columnIsNullable, columnDataType, columnDefaultConstraint } from './DatabaseColumn';
import { foreignKeyDeleteCascades, foreignKeyExists } from './DatabaseForeignKey';
import { tableExists, tablePrimaryKeys } from './DatabaseTable';
import type { DatabaseColumn } from './DatabaseColumn';
import type { DatabaseForeignKey } from './DatabaseForeignKey';

describe('when common is a required property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const contextName: string = 'ContextName';
  const domainEntityName: string = 'DomainEntityName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';
  const integerPropertyName4: string = 'IntegerPropertyName4';
  const integerPropertyName5: string = 'IntegerPropertyName5';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', false, false)
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false, null, null, contextName)
      .withIntegerProperty(integerPropertyName3, 'Documentation', true, false)
      .withIntegerProperty(integerPropertyName4, 'Documentation', false, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName5, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have common properties', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName1);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);

    const contextColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + commonName,
      contextName + integerPropertyName2,
    );
    expect(await columnExists(contextColumn)).toBe(true);
    expect(await columnIsNullable(contextColumn)).toBe(true);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName3);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, integerPropertyName5)],
      [column(namespaceName, domainEntityName, integerPropertyName5)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.dateTime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });

  it('should have join table for collection property', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName + integerPropertyName4))).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName + integerPropertyName4))).toEqual([
      integerPropertyName4,
      integerPropertyName5,
    ]);
  });

  it('should have collection property', async () => {
    const collectionColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + commonName + integerPropertyName4,
      integerPropertyName4,
    );
    expect(await columnExists(collectionColumn)).toBe(true);
    expect(await columnIsNullable(collectionColumn)).toBe(false);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName + integerPropertyName4, integerPropertyName5)],
      [column(namespaceName, domainEntityName + commonName, integerPropertyName5)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + commonName + integerPropertyName4,
      'CreateDate',
    );
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.dateTime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName + integerPropertyName4, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + commonName + integerPropertyName4,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });
});

describe('when common is a required property with context', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const contextName1: string = 'ContextName1';
  const contextName2: string = 'ContextName2';
  const domainEntityName: string = 'DomainEntityName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';
  const integerPropertyName4: string = 'IntegerPropertyName4';
  const integerPropertyName5: string = 'IntegerPropertyName5';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', false, false)
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false, null, null, contextName1)
      .withIntegerProperty(integerPropertyName3, 'Documentation', true, false)
      .withIntegerProperty(integerPropertyName4, 'Documentation', false, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName5, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false, contextName2)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName2 + commonName))).toBe(true);
  });

  it('should have common properties', async () => {
    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName2 + commonName,
      integerPropertyName1,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);

    const contextColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName2 + commonName,
      contextName1 + integerPropertyName2,
    );
    expect(await columnExists(contextColumn)).toBe(true);
    expect(await columnIsNullable(contextColumn)).toBe(true);

    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName2 + commonName,
      integerPropertyName3,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName2 + commonName, integerPropertyName5)],
      [column(namespaceName, domainEntityName, integerPropertyName5)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName2 + commonName,
      'CreateDate',
    );
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.dateTime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, domainEntityName + contextName2 + commonName, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName2 + commonName,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });

  it('should have join table for collection property', async () => {
    expect(
      await tableExists(table(namespaceName, domainEntityName + contextName2 + commonName + integerPropertyName4)),
    ).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(
      await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName2 + commonName + integerPropertyName4)),
    ).toEqual([integerPropertyName4, integerPropertyName5]);
  });

  it('should have collection property', async () => {
    const collectionColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName2 + commonName + integerPropertyName4,
      integerPropertyName4,
    );
    expect(await columnExists(collectionColumn)).toBe(true);
    expect(await columnIsNullable(collectionColumn)).toBe(false);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName2 + commonName + integerPropertyName4, integerPropertyName5)],
      [column(namespaceName, domainEntityName + contextName2 + commonName, integerPropertyName5)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName2 + commonName + integerPropertyName4,
      'CreateDate',
    );
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.dateTime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName2 + commonName + integerPropertyName4,
      'Id',
    );
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName2 + commonName + integerPropertyName4,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });
});

describe('when common is an optional property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const domainEntityName: string = 'DomainEntityName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', false, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', false, false)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName))).toEqual([integerPropertyName2]);
  });

  it('should have common property', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName1);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, integerPropertyName2)],
      [column(namespaceName, domainEntityName, integerPropertyName2)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when common is a required collection property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const domainEntityName: string = 'DomainEntityName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, true)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have common properties', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName1);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);

    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName2);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName))).toEqual([
      integerPropertyName1,
      integerPropertyName3,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, integerPropertyName3)],
      [column(namespaceName, domainEntityName, integerPropertyName3)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when common is an optional collection property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const domainEntityName: string = 'DomainEntityName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', false, true)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have common properties', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName1);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);

    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName2);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName))).toEqual([
      integerPropertyName1,
      integerPropertyName3,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, integerPropertyName3)],
      [column(namespaceName, domainEntityName, integerPropertyName3)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when common is a required property with primary key', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const domainEntityName: string = 'DomainEntityName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have common properties', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName1);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);

    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName2);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName))).toEqual([
      integerPropertyName1,
      integerPropertyName3,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, integerPropertyName3)],
      [column(namespaceName, domainEntityName, integerPropertyName3)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when common has an enumeration property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const domainEntityName: string = 'DomainEntityName';
  const enumerationName: string = 'EnumerationName';
  const enumerationTableName: string = `${enumerationName}Type`;
  const enumerationColumnName: string = `${enumerationName}TypeId`;
  const enumerationItemName: string = 'EnumerationItemName';
  const integerPropertyName: string = 'IntegerPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(enumerationName)
      .withDocumentation('Documentation')
      .withEnumerationItem(enumerationItemName, 'Documentation')
      .withEndEnumeration()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withEnumerationProperty(enumerationName, 'Documentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', false, false)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have enumeration property', async () => {
    const enumerationItemColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + commonName,
      enumerationColumnName,
    );
    expect(await columnExists(enumerationItemColumn)).toBe(true);
    expect(await columnIsNullable(enumerationItemColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName))).toEqual([integerPropertyName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, integerPropertyName)],
      [column(namespaceName, domainEntityName, integerPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, enumerationColumnName)],
      [column(namespaceName, enumerationTableName, enumerationColumnName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);
  });
});

describe('when common has a collection enumeration property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const domainEntityName: string = 'DomainEntityName';
  const enumerationName: string = 'EnumerationName';
  const enumerationTableName: string = `${enumerationName}Type`;
  const enumerationColumnName: string = `${enumerationName}TypeId`;
  const enumerationItemName: string = 'EnumerationItemName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(enumerationName)
      .withDocumentation('Documentation')
      .withEnumerationItem(enumerationItemName, 'Documentation')
      .withEndEnumeration()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEnumerationProperty(enumerationName, 'Documentation', true, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', false, true)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, integerPropertyName2)],
      [column(namespaceName, domainEntityName, integerPropertyName2)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have join table for enumeration', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName + enumerationName))).toBe(true);
  });

  it('should have enumeration property', async () => {
    const enumerationItemColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + commonName + enumerationName,
      enumerationColumnName,
    );
    expect(await columnExists(enumerationItemColumn)).toBe(true);
    expect(await columnIsNullable(enumerationItemColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName + enumerationName))).toEqual([
      enumerationColumnName,
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName + commonName + enumerationName, integerPropertyName1),
        column(namespaceName, domainEntityName + commonName + enumerationName, integerPropertyName2),
      ],
      [
        column(namespaceName, domainEntityName + commonName, integerPropertyName1),
        column(namespaceName, domainEntityName + commonName, integerPropertyName2),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName + enumerationName, enumerationColumnName)],
      [column(namespaceName, enumerationTableName, enumerationColumnName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);
  });
});

describe('when common has a descriptor property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const commonName: string = 'CommonName';
  const domainEntityName: string = 'DomainEntityName';
  const descriptorName: string = 'DescriptorName';
  const descriptorTableName: string = `${descriptorName}Descriptor`;
  const descriptorColumnName: string = `${descriptorName}DescriptorId`;
  const integerPropertyName: string = 'IntegerPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('Documentation')
      .withEndDescriptor()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withDescriptorProperty(descriptorName, 'Documentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have descriptor IntegerPropertyName2', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, descriptorColumnName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName))).toEqual([integerPropertyName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, integerPropertyName)],
      [column(namespaceName, domainEntityName, integerPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, descriptorColumnName)],
      [column(namespaceName, descriptorTableName, descriptorColumnName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);
  });
});

describe('when common has a collection descriptor property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const commonName: string = 'CommonName';
  const domainEntityName: string = 'DomainEntityName';
  const descriptorName: string = 'DescriptorName';
  const descriptorTableName: string = `${descriptorName}Descriptor`;
  const descriptorColumnName: string = `${descriptorName}DescriptorId`;
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('Documentation')
      .withEndDescriptor()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withDescriptorProperty(descriptorName, 'Documentation', true, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName, integerPropertyName2)],
      [column(namespaceName, domainEntityName, integerPropertyName2)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have join table for descriptor', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName + descriptorName))).toBe(true);
  });

  it('should have descriptor property', async () => {
    const descriptorItemColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + commonName + descriptorName,
      descriptorColumnName,
    );
    expect(await columnExists(descriptorItemColumn)).toBe(true);
    expect(await columnIsNullable(descriptorItemColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName + descriptorName))).toEqual([
      descriptorColumnName,
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName + commonName + descriptorName, integerPropertyName1),
        column(namespaceName, domainEntityName + commonName + descriptorName, integerPropertyName2),
      ],
      [
        column(namespaceName, domainEntityName + commonName, integerPropertyName1),
        column(namespaceName, domainEntityName + commonName, integerPropertyName2),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName + descriptorName, descriptorColumnName)],
      [column(namespaceName, descriptorTableName, descriptorColumnName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);
  });
});

describe('when common has a domain entity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withDomainEntityProperty(domainEntityName1, 'Documentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName2))).toBe(true);
  });

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName2 + commonName))).toBe(true);
  });

  it('should have domain entity property', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName2 + commonName, integerPropertyName1);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName2 + commonName))).toEqual([integerPropertyName2]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName2 + commonName, integerPropertyName2)],
      [column(namespaceName, domainEntityName2, integerPropertyName2)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName2 + commonName, integerPropertyName1)],
      [column(namespaceName, domainEntityName1, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);
  });
});

describe('when common has a collection domain entity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withDomainEntityProperty(domainEntityName1, 'Documentation', true, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName2))).toBe(true);
  });

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName2 + commonName))).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName2 + commonName))).toEqual([integerPropertyName2]);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName2 + commonName + domainEntityName1))).toBe(true);
  });

  it('should have domain entity property', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName2 + commonName + domainEntityName1,
      integerPropertyName1,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName2 + commonName + domainEntityName1))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName2 + commonName + domainEntityName1, integerPropertyName2)],
      [column(namespaceName, domainEntityName2 + commonName, integerPropertyName2)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName2 + commonName + domainEntityName1, integerPropertyName1)],
      [column(namespaceName, domainEntityName1, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);
  });
});

describe('when common has a common property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName1: string = 'CommonName1';
  const commonName2: string = 'CommonName2';
  const domainEntityName: string = 'DomainEntityName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName1)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', true, false)
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartCommon(commonName2)
      .withDocumentation('Documentation')
      .withCommonProperty(commonName1, 'Documentation', true, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName2, 'Documentation', false, true)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName2))).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName2))).toEqual([integerPropertyName3]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName2, integerPropertyName3)],
      [column(namespaceName, domainEntityName, integerPropertyName3)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have join table for nested common', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName2 + commonName1))).toBe(true);
  });

  it('should have nested common properties', async () => {
    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + commonName2 + commonName1,
      integerPropertyName1,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + commonName2 + commonName1,
      integerPropertyName2,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName2 + commonName1))).toEqual([
      integerPropertyName3,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName2 + commonName1, integerPropertyName3)],
      [column(namespaceName, domainEntityName + commonName2, integerPropertyName3)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when common has a collection common property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName1: string = 'CommonName1';
  const commonName2: string = 'CommonName2';
  const domainEntityName: string = 'DomainEntityName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartCommon(commonName2)
      .withDocumentation('Documentation')
      .withCommonProperty(commonName1, 'Documentation', true, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName2, 'Documentation', false, true)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName2))).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName2))).toEqual([integerPropertyName3]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName2, integerPropertyName3)],
      [column(namespaceName, domainEntityName, integerPropertyName3)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have join table for nested common', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName2 + commonName1))).toBe(true);
  });

  it('should have nested common properties', async () => {
    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + commonName2 + commonName1,
      integerPropertyName1,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + commonName2 + commonName1,
      integerPropertyName2,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName2 + commonName1))).toEqual([
      integerPropertyName1,
      integerPropertyName3,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + commonName2 + commonName1, integerPropertyName3)],
      [column(namespaceName, domainEntityName + commonName2, integerPropertyName3)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when common has an inline common property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const domainEntityName: string = 'DomainEntityName';
  const inlineCommonName: string = 'InlineCommonName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', true, false)
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndInlineCommon()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, true)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have inline common properties', async () => {
    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName1);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(true);

    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName2);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });
});

describe('when common has a choice property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const choiceName: string = 'ChoiceName';
  const commonName: string = 'CommonName';
  const domainEntityName: string = 'DomainEntityName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartChoice(choiceName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', true, false)
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndChoice()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withChoiceProperty(choiceName, 'Documentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, true)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have inline common properties', async () => {
    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName1);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(true);

    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName2);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });
});

describe('when common has name that starts with another entities name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'EntityNameCommonName';
  const domainEntityName: string = 'EntityName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, true)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, commonName))).toBe(true);
  });
});

describe('when common has name that overlaps with another entities name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'OverlapCommonName';
  const domainEntityName: string = 'EntityNameOverlap';
  const overlappedName: string = 'EntityNameOverlapCommonName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, true)
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

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, overlappedName))).toBe(true);
  });
});

describe('when common has overlapping property names with another entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const commonName: string = 'CommonName';
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName2, 'Documentation')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName1))).toBe(true);
  });

  it('should have join table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName1 + commonName))).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName1 + commonName))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
      integerPropertyName3,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName1 + commonName, integerPropertyName1),
        column(namespaceName, domainEntityName1 + commonName, integerPropertyName2),
      ],
      [
        column(namespaceName, domainEntityName1, integerPropertyName1),
        column(namespaceName, domainEntityName1, integerPropertyName2),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName1 + commonName, integerPropertyName2),
        column(namespaceName, domainEntityName1 + commonName, integerPropertyName3),
      ],
      [
        column(namespaceName, domainEntityName2, integerPropertyName2),
        column(namespaceName, domainEntityName2, integerPropertyName3),
      ],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);
  });
});

describe('when core common is referenced from extension entity as a required property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const extension: string = 'extension';
  const commonName: string = 'CommonName';
  const contextName: string = 'ContextName';
  const domainEntityName: string = 'DomainEntityName';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';
  const integerPropertyName4: string = 'IntegerPropertyName4';
  const integerPropertyName5: string = 'IntegerPropertyName5';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', false, false)
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false, null, null, contextName)
      .withIntegerProperty(integerPropertyName3, 'Documentation', true, false)
      .withIntegerProperty(integerPropertyName4, 'Documentation', false, true)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName5, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    const coreNamespace: ?Namespace = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: ?Namespace = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(extension, domainEntityName))).toBe(true);
  });

  it('should have join table', async () => {
    expect(await tableExists(table(extension, domainEntityName + commonName))).toBe(true);
  });

  it('should have common properties', async () => {
    const optionalColumn: DatabaseColumn = column(extension, domainEntityName + commonName, integerPropertyName1);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);

    const contextColumn: DatabaseColumn = column(
      extension,
      domainEntityName + commonName,
      contextName + integerPropertyName2,
    );
    expect(await columnExists(contextColumn)).toBe(true);
    expect(await columnIsNullable(contextColumn)).toBe(true);

    const requiredColumn: DatabaseColumn = column(extension, domainEntityName + commonName, integerPropertyName3);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName + commonName))).toEqual([integerPropertyName5]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName + commonName, integerPropertyName5)],
      [column(extension, domainEntityName, integerPropertyName5)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(extension, domainEntityName + commonName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.dateTime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(extension, domainEntityName + commonName, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(extension, domainEntityName + commonName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(extension, domainEntityName + commonName + integerPropertyName4))).toBe(true);
  });

  it('should have collection property', async () => {
    const optionalColumn: DatabaseColumn = column(
      extension,
      domainEntityName + commonName + integerPropertyName4,
      integerPropertyName4,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName + commonName + integerPropertyName4))).toEqual([
      integerPropertyName4,
      integerPropertyName5,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName + commonName + integerPropertyName4, integerPropertyName5)],
      [column(extension, domainEntityName + commonName, integerPropertyName5)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(
      extension,
      domainEntityName + commonName + integerPropertyName4,
      'CreateDate',
    );
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.dateTime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(extension, domainEntityName + commonName + integerPropertyName4, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      extension,
      domainEntityName + commonName + integerPropertyName4,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });
});

describe('when extension common is referenced from extension entity as a required property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const extension: string = 'extension';
  const commonName: string = 'CommonName';
  const contextName: string = 'ContextName';
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const integerPropertyName1: string = 'IntegerPropertyName1';
  const integerPropertyName2: string = 'IntegerPropertyName2';
  const integerPropertyName3: string = 'IntegerPropertyName3';
  const integerPropertyName4: string = 'IntegerPropertyName4';
  const integerPropertyName5: string = 'IntegerPropertyName5';
  const integerPropertyName6: string = 'IntegerPropertyName6';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false, null, null, contextName)
      .withIntegerProperty(integerPropertyName4, 'Documentation', true, false)
      .withIntegerProperty(integerPropertyName5, 'Documentation', false, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName6, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    const coreNamespace: ?Namespace = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: ?Namespace = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(extension, domainEntityName2))).toBe(true);
  });

  it('should have join table', async () => {
    expect(await tableExists(table(extension, domainEntityName2 + commonName))).toBe(true);
  });

  it('should have common properties', async () => {
    const optionalColumn: DatabaseColumn = column(extension, domainEntityName2 + commonName, integerPropertyName2);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);

    const contextColumn: DatabaseColumn = column(
      extension,
      domainEntityName2 + commonName,
      contextName + integerPropertyName3,
    );
    expect(await columnExists(contextColumn)).toBe(true);
    expect(await columnIsNullable(contextColumn)).toBe(true);

    const requiredColumn: DatabaseColumn = column(extension, domainEntityName2 + commonName, integerPropertyName4);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName2 + commonName))).toEqual([integerPropertyName6]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName2 + commonName, integerPropertyName6)],
      [column(extension, domainEntityName2, integerPropertyName6)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(extension, domainEntityName2 + commonName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.dateTime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(extension, domainEntityName2 + commonName, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(extension, domainEntityName2 + commonName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(extension, domainEntityName2 + commonName + integerPropertyName5))).toBe(true);
  });

  it('should have collection property', async () => {
    const optionalColumn: DatabaseColumn = column(
      extension,
      domainEntityName2 + commonName + integerPropertyName5,
      integerPropertyName5,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName2 + commonName + integerPropertyName5))).toEqual([
      integerPropertyName5,
      integerPropertyName6,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName2 + commonName + integerPropertyName5, integerPropertyName6)],
      [column(extension, domainEntityName2 + commonName, integerPropertyName6)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date resource column', async () => {
    const createDateColumn: DatabaseColumn = column(
      extension,
      domainEntityName2 + commonName + integerPropertyName5,
      'CreateDate',
    );
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.dateTime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have id and last modified date resource columns', async () => {
    const idColumn: DatabaseColumn = column(extension, domainEntityName2 + commonName + integerPropertyName5, 'Id');
    expect(await columnExists(idColumn)).toBe(false);

    const lastModifiedDateColumn: DatabaseColumn = column(
      extension,
      domainEntityName2 + commonName + integerPropertyName5,
      'LastModifiedDate',
    );
    expect(await columnExists(lastModifiedDateColumn)).toBe(false);
  });
});
