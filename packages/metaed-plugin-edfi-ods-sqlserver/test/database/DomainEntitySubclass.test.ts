import {
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
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

describe('when core domain entity subclass has identity rename property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, `${namespaceName}.${domainEntityName}`)
      .withDocumentation('Documentation')
      .withIntegerIdentityRename(integerPropertyName2, integerPropertyName1, 'Documentation')
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

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

  it('should have domain entity subclass table', async () => {
    expect(await tableExists(table(namespaceName, domainEntitySubclassName))).toBe(true);
  });

  it('should have domain entity subclass column', async () => {
    expect(await columnExists(column(namespaceName, domainEntitySubclassName, integerPropertyName2))).toBe(true);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntitySubclassName))).toEqual([integerPropertyName2]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntitySubclassName, integerPropertyName2)],
      [column(namespaceName, domainEntityName, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should not have standard resource columns', async () => {
    expect(await columnExists(column(namespaceName, domainEntitySubclassName, 'Id'))).toBe(false);
    expect(await columnExists(column(namespaceName, domainEntitySubclassName, 'LastModifiedDate'))).toBe(false);
    expect(await columnExists(column(namespaceName, domainEntitySubclassName, 'CreateDate'))).toBe(false);
  });
});

describe('when extension domain entity subclasses core domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const extension = 'Extension';
  const domainEntityName = 'DomainEntityName';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntitySubclass(domainEntitySubclassName, `${namespaceName}.${domainEntityName}`)
      .withDocumentation('Documentation')
      .withIntegerIdentityRename(integerPropertyName2, integerPropertyName1, 'Documentation')
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

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

  it('should have domain entity subclass table', async () => {
    expect(await tableExists(table(extension, domainEntitySubclassName))).toBe(true);
  });

  it('should have domain entity subclass column', async () => {
    expect(await columnExists(column(extension, domainEntitySubclassName, integerPropertyName2))).toBe(true);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntitySubclassName))).toEqual([integerPropertyName2]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntitySubclassName, integerPropertyName2)],
      [column(namespaceName, domainEntityName, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should not have standard resource columns', async () => {
    expect(await columnExists(column(extension, domainEntitySubclassName, 'Id'))).toBe(false);
    expect(await columnExists(column(extension, domainEntitySubclassName, 'LastModifiedDate'))).toBe(false);
    expect(await columnExists(column(extension, domainEntitySubclassName, 'CreateDate'))).toBe(false);
  });
});

describe('when extension domain entity subclasses extension domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const extension = 'Extension';
  const domainEntityName = 'DomainEntityName';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(extension)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentityRename(integerPropertyName2, integerPropertyName1, 'Documentation')
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(extension, domainEntityName))).toBe(true);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(extension, domainEntityName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(extension, domainEntityName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(extension, domainEntityName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should have domain entity subclass table', async () => {
    expect(await tableExists(table(extension, domainEntitySubclassName))).toBe(true);
  });

  it('should have domain entity subclass column', async () => {
    expect(await columnExists(column(extension, domainEntitySubclassName, integerPropertyName2))).toBe(true);
  });

  it('should have correct primary key', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntitySubclassName))).toEqual([integerPropertyName2]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntitySubclassName, integerPropertyName2)],
      [column(extension, domainEntityName, integerPropertyName1)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should not have standard resource columns', async () => {
    expect(await columnExists(column(extension, domainEntitySubclassName, 'Id'))).toBe(false);
    expect(await columnExists(column(extension, domainEntitySubclassName, 'LastModifiedDate'))).toBe(false);
    expect(await columnExists(column(extension, domainEntitySubclassName, 'CreateDate'))).toBe(false);
  });
});
