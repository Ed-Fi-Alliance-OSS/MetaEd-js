import {
  CommonBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  column,
  columnDataTypes,
  enhanceGenerateAndExecuteSql,
  foreignKey,
  table,
  testTearDown,
  testSuiteAfterAll,
} from './DatabaseTestBase';
import { columnExists, columnIsNullable, columnDataType, columnDefaultConstraint } from './DatabaseColumn';
import { foreignKeyDeleteCascades, foreignKeyExists } from './DatabaseForeignKey';
import { tableExists, tablePrimaryKeys } from './DatabaseTable';
import { DatabaseColumn } from './DatabaseColumn';
import { DatabaseForeignKey } from './DatabaseForeignKey';

jest.setTimeout(40000);

afterAll(async () => testSuiteAfterAll());

describe('when domain entity extension has multiple properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const extension = 'Extension';
  const commonName = 'CommonName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityExtensionName = `${domainEntityName}Extension`;
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyName4 = 'IntegerPropertyName4';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${namespaceName}.${domainEntityName}`)
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withIntegerProperty(integerPropertyName4, 'Documentation', false, true)
      .withCommonProperty(`${namespaceName}.${commonName}`, 'Documentation', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should have domain entity extension table', async () => {
    expect(await tableExists(table(extension, domainEntityExtensionName))).toBe(true);
  });

  it('should have domain entity extension column', async () => {
    expect(await columnExists(column(extension, domainEntityExtensionName, integerPropertyName3))).toBe(true);
  });

  it('should have domain entity primary keys as domain entity extension primary key', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityExtensionName))).toEqual([integerPropertyName1]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityExtensionName, integerPropertyName1)],
      [column(namespaceName, domainEntityName, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date column', async () => {
    expect(await columnExists(column(extension, domainEntityExtensionName, 'CreateDate'))).toBe(true);
  });

  it('should not have id and last modified data columns', async () => {
    expect(await columnExists(column(extension, domainEntityExtensionName, 'Id'))).toBe(false);
    expect(await columnExists(column(extension, domainEntityExtensionName, 'LastModifiedDate'))).toBe(false);
  });

  it('should have common table', async () => {
    expect(await tableExists(table(extension, domainEntityName + commonName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const referenceColumn1: DatabaseColumn = column(extension, domainEntityName + commonName, integerPropertyName1);
    expect(await columnExists(referenceColumn1)).toBe(true);
    expect(await columnIsNullable(referenceColumn1)).toBe(false);
    expect(await columnDataType(referenceColumn1)).toBe(columnDataTypes.integer);

    const referenceColumn2: DatabaseColumn = column(extension, domainEntityName + commonName, integerPropertyName2);
    expect(await columnExists(referenceColumn2)).toBe(true);
    expect(await columnIsNullable(referenceColumn2)).toBe(false);
    expect(await columnDataType(referenceColumn2)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName + commonName))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName + commonName, integerPropertyName1)],
      [column(namespaceName, domainEntityName, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date column', async () => {
    expect(await columnExists(column(extension, domainEntityName + commonName, 'CreateDate'))).toBe(true);
  });

  it('should not have id and last modified data columns', async () => {
    expect(await columnExists(column(extension, domainEntityName + commonName, 'Id'))).toBe(false);
    expect(await columnExists(column(extension, domainEntityName + commonName, 'LastModifiedDate'))).toBe(false);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(extension, domainEntityName + integerPropertyName4))).toBe(true);
  });

  it('should have correct columns', async () => {
    const referenceColumn1: DatabaseColumn = column(
      extension,
      domainEntityName + integerPropertyName4,
      integerPropertyName1,
    );
    expect(await columnExists(referenceColumn1)).toBe(true);
    expect(await columnIsNullable(referenceColumn1)).toBe(false);
    expect(await columnDataType(referenceColumn1)).toBe(columnDataTypes.integer);

    const referenceColumn2: DatabaseColumn = column(
      extension,
      domainEntityName + integerPropertyName4,
      integerPropertyName4,
    );
    expect(await columnExists(referenceColumn2)).toBe(true);
    expect(await columnIsNullable(referenceColumn2)).toBe(false);
    expect(await columnDataType(referenceColumn2)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName + integerPropertyName4))).toEqual([
      integerPropertyName1,
      integerPropertyName4,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName + integerPropertyName4, integerPropertyName1)],
      [column(namespaceName, domainEntityName, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date column', async () => {
    expect(await columnExists(column(extension, domainEntityName + integerPropertyName4, 'CreateDate'))).toBe(true);
  });

  it('should not have id and last modified data columns', async () => {
    expect(await columnExists(column(extension, domainEntityName + integerPropertyName4, 'Id'))).toBe(false);
    expect(await columnExists(column(extension, domainEntityName + integerPropertyName4, 'LastModifiedDate'))).toBe(false);
  });
});

describe('when domain entity extension has optional collection property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const extension = 'Extension';
  const domainEntityName = 'DomainEntityName';
  const domainEntityExtensionName = `${domainEntityName}Extension`;
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${namespaceName}.${domainEntityName}`)
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have domain entity extension table', async () => {
    expect(await tableExists(table(extension, domainEntityExtensionName))).toBe(false);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(extension, domainEntityName + integerPropertyName2))).toBe(true);
  });

  it('should have correct columns', async () => {
    const referenceColumn: DatabaseColumn = column(extension, domainEntityName + integerPropertyName2, integerPropertyName1);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(false);
    expect(await columnDataType(referenceColumn)).toBe(columnDataTypes.integer);

    const collectionColumn: DatabaseColumn = column(
      extension,
      domainEntityName + integerPropertyName2,
      integerPropertyName2,
    );
    expect(await columnExists(collectionColumn)).toBe(true);
    expect(await columnIsNullable(collectionColumn)).toBe(false);
    expect(await columnDataType(collectionColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName + integerPropertyName2))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName + integerPropertyName2, integerPropertyName1)],
      [column(namespaceName, domainEntityName, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date column', async () => {
    expect(await columnExists(column(extension, domainEntityName + integerPropertyName2, 'CreateDate'))).toBe(true);
  });

  it('should not have id and last modified data columns', async () => {
    expect(await columnExists(column(extension, domainEntityName + integerPropertyName2, 'Id'))).toBe(false);
    expect(await columnExists(column(extension, domainEntityName + integerPropertyName2, 'LastModifiedDate'))).toBe(false);
  });
});

describe('when domain entity extension has required collection property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const extension = 'Extension';
  const domainEntityName = 'DomainEntityName';
  const domainEntityExtensionName = `${domainEntityName}Extension`;
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${namespaceName}.${domainEntityName}`)
      .withIntegerProperty(integerPropertyName2, 'Documentation', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have domain entity extension table', async () => {
    expect(await tableExists(table(extension, domainEntityExtensionName))).toBe(false);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(extension, domainEntityName + integerPropertyName2))).toBe(true);
  });

  it('should have correct columns', async () => {
    const referenceColumn: DatabaseColumn = column(extension, domainEntityName + integerPropertyName2, integerPropertyName1);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(false);
    expect(await columnDataType(referenceColumn)).toBe(columnDataTypes.integer);

    const collectionColumn: DatabaseColumn = column(
      extension,
      domainEntityName + integerPropertyName2,
      integerPropertyName2,
    );
    expect(await columnExists(collectionColumn)).toBe(true);
    expect(await columnIsNullable(collectionColumn)).toBe(false);
    expect(await columnDataType(collectionColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName + integerPropertyName2))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName + integerPropertyName2, integerPropertyName1)],
      [column(namespaceName, domainEntityName, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date column', async () => {
    expect(await columnExists(column(extension, domainEntityName + integerPropertyName2, 'CreateDate'))).toBe(true);
  });

  it('should not have id and last modified data columns', async () => {
    expect(await columnExists(column(extension, domainEntityName + integerPropertyName2, 'Id'))).toBe(false);
    expect(await columnExists(column(extension, domainEntityName + integerPropertyName2, 'LastModifiedDate'))).toBe(false);
  });
});

describe('when domain entity extension has multiple common properties', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.0.0' };
  const namespaceName = 'Namespace';
  const extension = 'Extension';
  const commonName1 = 'CommonName1';
  const commonName2 = 'CommonName2';
  const domainEntityName = 'DomainEntityName';
  const domainEntityExtensionName = `${domainEntityName}Extension`;
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartCommon(commonName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndCommon()

      .withStartCommon(commonName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withEndCommon()

      .withStartDomainEntityExtension(`${namespaceName}.${domainEntityName}`)
      .withCommonProperty(commonName1, 'Documentation', false, false)
      .withCommonProperty(commonName2, 'Documentation', false, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, domainEntityName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have domain entity extension table', async () => {
    expect(await tableExists(table(extension, domainEntityExtensionName))).toBe(false);
  });

  it('should have common table', async () => {
    expect(await tableExists(table(extension, domainEntityName + commonName1))).toBe(true);
  });

  it('should have correct columns', async () => {
    const referenceColumn1: DatabaseColumn = column(extension, domainEntityName + commonName1, integerPropertyName1);
    expect(await columnExists(referenceColumn1)).toBe(true);
    expect(await columnIsNullable(referenceColumn1)).toBe(false);
    expect(await columnDataType(referenceColumn1)).toBe(columnDataTypes.integer);

    const referenceColumn2: DatabaseColumn = column(extension, domainEntityName + commonName1, integerPropertyName2);
    expect(await columnExists(referenceColumn2)).toBe(true);
    expect(await columnIsNullable(referenceColumn2)).toBe(false);
    expect(await columnDataType(referenceColumn2)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName + commonName1))).toEqual([integerPropertyName1]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName + commonName1, integerPropertyName1)],
      [column(namespaceName, domainEntityName, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date column', async () => {
    expect(await columnExists(column(extension, domainEntityName + commonName1, 'CreateDate'))).toBe(true);
  });

  it('should not have id and last modified data columns', async () => {
    expect(await columnExists(column(extension, domainEntityName + commonName1, 'Id'))).toBe(false);
    expect(await columnExists(column(extension, domainEntityName + commonName1, 'LastModifiedDate'))).toBe(false);
  });

  it('should have common collection table', async () => {
    expect(await tableExists(table(extension, domainEntityName + commonName2))).toBe(true);
  });

  it('should have correct columns', async () => {
    const referenceColumn1: DatabaseColumn = column(extension, domainEntityName + commonName2, integerPropertyName1);
    expect(await columnExists(referenceColumn1)).toBe(true);
    expect(await columnIsNullable(referenceColumn1)).toBe(false);
    expect(await columnDataType(referenceColumn1)).toBe(columnDataTypes.integer);

    const referenceColumn3: DatabaseColumn = column(extension, domainEntityName + commonName2, integerPropertyName3);
    expect(await columnExists(referenceColumn3)).toBe(true);
    expect(await columnIsNullable(referenceColumn3)).toBe(false);
    expect(await columnDataType(referenceColumn3)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName + commonName2))).toEqual([
      integerPropertyName1,
      integerPropertyName3,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName + commonName2, integerPropertyName1)],
      [column(namespaceName, domainEntityName, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have create date column', async () => {
    expect(await columnExists(column(extension, domainEntityName + commonName2, 'CreateDate'))).toBe(true);
  });

  it('should not have id and last modified data columns', async () => {
    expect(await columnExists(column(extension, domainEntityName + commonName2, 'Id'))).toBe(false);
    expect(await columnExists(column(extension, domainEntityName + commonName2, 'LastModifiedDate'))).toBe(false);
  });
});
