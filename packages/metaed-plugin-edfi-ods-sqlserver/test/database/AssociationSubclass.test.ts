import {
  AssociationBuilder,
  AssociationSubclassBuilder,
  DomainEntityBuilder,
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

describe('when association subclass has a single property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const associationName = 'AssociationName';
  const associationSubclassName = 'AssociationSubclassName';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withEndAssociation()

      .withStartAssociationSubclass(associationSubclassName, associationName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have association subclass table', async () => {
    expect(await tableExists(table(namespaceName, associationSubclassName))).toBe(true);
  });

  it('should have association subclass column', async () => {
    expect(await columnExists(column(namespaceName, associationSubclassName, integerPropertyName3))).toBe(true);
  });

  it('should have domain entity primary keys as association primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, associationSubclassName))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, associationSubclassName, integerPropertyName1),
        column(namespaceName, associationSubclassName, integerPropertyName2),
      ],
      [
        column(namespaceName, associationName, integerPropertyName1),
        column(namespaceName, associationName, integerPropertyName2),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have standard resource columns on association', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, associationName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, associationName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, associationName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have standard resource columns on association subclass', async () => {
    expect(await columnExists(column(namespaceName, associationSubclassName, 'Id'))).toBe(false);
    expect(await columnExists(column(namespaceName, associationSubclassName, 'LastModifiedDate'))).toBe(false);
    expect(await columnExists(column(namespaceName, associationSubclassName, 'CreateDate'))).toBe(false);
  });
});

describe('when extension association subclasses core association', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const extension = 'Extension';
  const associationName = 'AssociationName';
  const associationSubclassName = 'AssociationSubclassName';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartAssociationSubclass(associationSubclassName, `${namespaceName}.${associationName}`)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have association subclass table', async () => {
    expect(await tableExists(table(extension, associationSubclassName))).toBe(true);
  });

  it('should have association subclass column', async () => {
    expect(await columnExists(column(extension, associationSubclassName, integerPropertyName3))).toBe(true);
  });

  it('should have domain entity primary keys as association primary key', async () => {
    expect(await tablePrimaryKeys(table(extension, associationSubclassName))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(extension, associationSubclassName, integerPropertyName1),
        column(extension, associationSubclassName, integerPropertyName2),
      ],
      [
        column(namespaceName, associationName, integerPropertyName1),
        column(namespaceName, associationName, integerPropertyName2),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have standard resource columns on association', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, associationName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, associationName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, associationName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have standard resource columns on association subclass', async () => {
    expect(await columnExists(column(extension, associationSubclassName, 'Id'))).toBe(false);
    expect(await columnExists(column(extension, associationSubclassName, 'LastModifiedDate'))).toBe(false);
    expect(await columnExists(column(extension, associationSubclassName, 'CreateDate'))).toBe(false);
  });
});

describe('when extension association subclasses extension association', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreNamespaceName = 'EdFi';
  const extension = 'Extension';
  const associationName = 'AssociationName';
  const associationSubclassName = 'AssociationSubclassName';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(`${coreNamespaceName}.${domainEntityName1}`, 'Documentation')
      .withAssociationDomainEntityProperty(`${coreNamespaceName}.${domainEntityName2}`, 'Documentation')
      .withEndAssociation()

      .withStartAssociationSubclass(associationSubclassName, associationName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(coreNamespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have association subclass table', async () => {
    expect(await tableExists(table(extension, associationSubclassName))).toBe(true);
  });

  it('should have association subclass column', async () => {
    expect(await columnExists(column(extension, associationSubclassName, integerPropertyName3))).toBe(true);
  });

  it('should have domain entity primary keys as association primary key', async () => {
    expect(await tablePrimaryKeys(table(extension, associationSubclassName))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(extension, associationSubclassName, integerPropertyName1),
        column(extension, associationSubclassName, integerPropertyName2),
      ],
      [column(extension, associationName, integerPropertyName1), column(extension, associationName, integerPropertyName2)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have standard resource columns on association', async () => {
    const idColumn: DatabaseColumn = column(extension, associationName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(extension, associationName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(extension, associationName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should not have standard resource columns on association subclass', async () => {
    expect(await columnExists(column(extension, associationSubclassName, 'Id'))).toBe(false);
    expect(await columnExists(column(extension, associationSubclassName, 'LastModifiedDate'))).toBe(false);
    expect(await columnExists(column(extension, associationSubclassName, 'CreateDate'))).toBe(false);
  });
});
