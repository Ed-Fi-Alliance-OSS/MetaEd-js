import {
  CommonBuilder,
  DescriptorBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  newPluginEnvironment,
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
import { columnExists, columnIsNullable, columnDataType, columnDefaultConstraint, columnLength } from './DatabaseColumn';
import { foreignKeyDeleteCascades, foreignKeyExists } from './DatabaseForeignKey';
import { tableExists, tablePrimaryKeys } from './DatabaseTable';
import { DatabaseColumn } from './DatabaseColumn';
import { DatabaseForeignKey } from './DatabaseForeignKey';

jest.setTimeout(40000);

afterAll(async () => testSuiteAfterAll());

describe('when creating domain entity in an extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const extension = 'Extension';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withDomainEntityProperty(`${namespaceName}.${domainEntityName1}`, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have core domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName1))).toBe(true);
  });

  it('should have correct column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName1, integerPropertyName1);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName1))).toEqual([integerPropertyName1]);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, domainEntityName1, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, domainEntityName1, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, domainEntityName1, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should have extension domain entity table', async () => {
    expect(await tableExists(table(extension, domainEntityName2))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(extension, domainEntityName2, integerPropertyName2);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const referenceColumn: DatabaseColumn = column(extension, domainEntityName2, integerPropertyName1);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(false);
    expect(await columnDataType(referenceColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName2))).toEqual([integerPropertyName2]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName2, integerPropertyName1)],
      [column(namespaceName, domainEntityName1, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(extension, domainEntityName2, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(extension, domainEntityName2, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(extension, domainEntityName2, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });
});

describe('when creating domain entity in an extension for ODS/API 7.2+', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '5.0.0' };
  metaEd.plugin.set('edfiOdsSqlServer', { ...newPluginEnvironment(), targetTechnologyVersion: '7.2.0' });
  const namespaceName = 'Namespace';
  const extension = 'Extension';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withDomainEntityProperty(`${namespaceName}.${domainEntityName1}`, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have core domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName1))).toBe(true);
  });

  it('should have correct column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName1, integerPropertyName1);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName1))).toEqual([integerPropertyName1]);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, domainEntityName1, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, domainEntityName1, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime2);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getutcdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, domainEntityName1, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime2);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getutcdate())');
  });

  it('should have extension domain entity table', async () => {
    expect(await tableExists(table(extension, domainEntityName2))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(extension, domainEntityName2, integerPropertyName2);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const referenceColumn: DatabaseColumn = column(extension, domainEntityName2, integerPropertyName1);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(false);
    expect(await columnDataType(referenceColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName2))).toEqual([integerPropertyName2]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName2, integerPropertyName1)],
      [column(namespaceName, domainEntityName1, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(extension, domainEntityName2, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(extension, domainEntityName2, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime2);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getutcdate())');

    const createDateColumn: DatabaseColumn = column(extension, domainEntityName2, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime2);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getutcdate())');
  });
});

describe('when creating domain entity based on abstract entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const abstractEntityName = 'AbstractEntityName';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have abstract entity table', async () => {
    expect(await tableExists(table(namespaceName, abstractEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, abstractEntityName, integerPropertyName1);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(namespaceName, abstractEntityName, integerPropertyName2);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, abstractEntityName))).toEqual([integerPropertyName1]);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, abstractEntityName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, abstractEntityName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, abstractEntityName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should have subclass table', async () => {
    expect(await tableExists(table(namespaceName, domainEntitySubclassName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const referenceColumn: DatabaseColumn = column(namespaceName, domainEntitySubclassName, integerPropertyName1);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(false);
    expect(await columnDataType(referenceColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntitySubclassName, integerPropertyName3);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.integer);
  });

  it('should not have standard resource columns', async () => {
    expect(await columnExists(column(namespaceName, domainEntitySubclassName, 'Id'))).toBe(false);
    expect(await columnExists(column(namespaceName, domainEntitySubclassName, 'LastModifiedDate'))).toBe(false);
    expect(await columnExists(column(namespaceName, domainEntitySubclassName, 'CreateDate'))).toBe(false);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntitySubclassName))).toEqual([integerPropertyName1]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntitySubclassName, integerPropertyName1)],
      [column(namespaceName, abstractEntityName, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when creating domain entity based on abstract entity with identity rename', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const abstractEntityName = 'AbstractEntityName';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const stringPropertyName = 'StringPropertyName';
  const stringPropertyRename = 'StringPropertyRename';
  const maxLength = 10;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('Documentation')
      .withStringIdentity(stringPropertyName, 'Documentation', maxLength.toString())
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, abstractEntityName)
      .withDocumentation('Documentation')
      .withStringIdentityRename(stringPropertyRename, stringPropertyName, 'Documentation', maxLength.toString())
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have abstract entity table', async () => {
    expect(await tableExists(table(namespaceName, abstractEntityName))).toBe(true);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, abstractEntityName, stringPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(identityColumn)).toBe(maxLength);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, abstractEntityName))).toEqual([stringPropertyName]);
  });

  it('should have subclass table', async () => {
    expect(await tableExists(table(namespaceName, domainEntitySubclassName))).toBe(true);
  });

  it('should have identity rename column', async () => {
    const identityRenameColumn: DatabaseColumn = column(namespaceName, domainEntitySubclassName, stringPropertyRename);
    expect(await columnExists(identityRenameColumn)).toBe(true);
    expect(await columnIsNullable(identityRenameColumn)).toBe(false);
    expect(await columnDataType(identityRenameColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(identityRenameColumn)).toBe(maxLength);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntitySubclassName))).toEqual([stringPropertyRename]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntitySubclassName, stringPropertyRename)],
      [column(namespaceName, abstractEntityName, stringPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});
describe('when domain entity based on abstract entity both have collection properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const abstractEntityName = 'AbstractEntityName';
  const commonName = 'CommonName';
  const descriptorName = 'DescriptorName';
  const descriptorColumnName = `${descriptorName}DescriptorId`;
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('Documentation')
      .withEndDescriptor()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', false, true)
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, abstractEntityName)
      .withDocumentation('Documentation')
      .withDescriptorProperty(descriptorName, 'Documentation', false, true)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have common collection table', async () => {
    expect(await tableExists(table(namespaceName, abstractEntityName + commonName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const referenceColumn: DatabaseColumn = column(namespaceName, abstractEntityName + commonName, integerPropertyName1);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(false);
    expect(await columnDataType(referenceColumn)).toBe(columnDataTypes.integer);

    const identityColumn: DatabaseColumn = column(namespaceName, abstractEntityName + commonName, integerPropertyName3);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, abstractEntityName + commonName))).toEqual([
      integerPropertyName1,
      integerPropertyName3,
    ]);
  });

  it('should have descriptor collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntitySubclassName + descriptorName))).toBe(true);
  });

  it('should have identity rename column', async () => {
    const descriptorColumn: DatabaseColumn = column(
      namespaceName,
      domainEntitySubclassName + descriptorName,
      descriptorColumnName,
    );
    expect(await columnExists(descriptorColumn)).toBe(true);
    expect(await columnIsNullable(descriptorColumn)).toBe(false);
    expect(await columnDataType(descriptorColumn)).toBe(columnDataTypes.integer);

    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntitySubclassName + descriptorName,
      integerPropertyName3,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntitySubclassName + descriptorName))).toEqual([
      descriptorColumnName,
      integerPropertyName3,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, abstractEntityName + commonName, integerPropertyName3)],
      [column(namespaceName, abstractEntityName, integerPropertyName3)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntitySubclassName + descriptorName, integerPropertyName3)],
      [column(namespaceName, domainEntitySubclassName, integerPropertyName3)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});
