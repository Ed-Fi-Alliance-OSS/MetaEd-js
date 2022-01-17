import {
  AssociationBuilder,
  AssociationExtensionBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  column,
  foreignKey,
  table,
  testTearDown,
  enhanceGenerateAndExecuteSql,
  testSuiteAfterAll,
} from './DatabaseTestBase';
import { columnExists, columnIsNullable } from './DatabaseColumn';
import { foreignKeyDeleteCascades, foreignKeyExists } from './DatabaseForeignKey';
import { tableExists, tablePrimaryKeys } from './DatabaseTable';
import { DatabaseColumn } from './DatabaseColumn';
import { DatabaseForeignKey } from './DatabaseForeignKey';

jest.setTimeout(40000);

afterAll(async () => testSuiteAfterAll());

describe('when common extension is a required common override property on association extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const extension = 'Extension';
  const associationName = 'AssociationName';
  const associationExtensionName = `${associationName}Extension`;
  const commonName = 'CommonName';
  const commonExtensionName = `${associationName + commonName}Extension`;
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyName4 = 'IntegerPropertyName4';
  const integerPropertyName5 = 'IntegerPropertyName5';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withIntegerProperty(integerPropertyName4, 'Documentation', true, false)
      .withCommonProperty(commonName, 'Documentation', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartAssociationExtension(`${namespaceName}.${associationName}`)
      .withCommonExtensionOverrideProperty(`${namespaceName}.${commonName}`, 'Documentation', true, false)
      .withEndAssociationExtension()

      .withStartCommonExtension(`${namespaceName}.${commonName}`)
      .withIntegerProperty(integerPropertyName5, 'Documentation', false, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have association table', async () => {
    expect(await tableExists(table(namespaceName, associationName))).toBe(true);
  });

  it('should have association extension table', async () => {
    expect(await tableExists(table(extension, associationExtensionName))).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, associationExtensionName))).toEqual([
      integerPropertyName2,
      integerPropertyName3,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(extension, associationExtensionName, integerPropertyName2),
        column(extension, associationExtensionName, integerPropertyName3),
      ],
      [
        column(namespaceName, associationName, integerPropertyName2),
        column(namespaceName, associationName, integerPropertyName3),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have common table', async () => {
    expect(await tableExists(table(namespaceName, associationName + commonName))).toBe(true);
  });

  it('should have common property', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, associationName + commonName, integerPropertyName1);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, associationName + commonName))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
      integerPropertyName3,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, associationName + commonName, integerPropertyName2),
        column(namespaceName, associationName + commonName, integerPropertyName3),
      ],
      [
        column(namespaceName, associationName, integerPropertyName2),
        column(namespaceName, associationName, integerPropertyName3),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have common extension table', async () => {
    expect(await tableExists(table(extension, commonExtensionName))).toBe(true);
  });

  it('should have common extension property', async () => {
    const optionalColumn: DatabaseColumn = column(extension, commonExtensionName, integerPropertyName5);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, commonExtensionName))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
      integerPropertyName3,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(extension, commonExtensionName, integerPropertyName1),
        column(extension, commonExtensionName, integerPropertyName2),
        column(extension, commonExtensionName, integerPropertyName3),
      ],
      [
        column(namespaceName, associationName + commonName, integerPropertyName1),
        column(namespaceName, associationName + commonName, integerPropertyName2),
        column(namespaceName, associationName + commonName, integerPropertyName3),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when common extension is a required common override property on domain entity extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const extension = 'Extension';
  const commonName = 'CommonName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityExtensionName = `${domainEntityName}Extension`;
  const commonExtensionName = `${domainEntityName + commonName}Extension`;
  const integerPropertyName2 = 'IntegerPropertyName1';
  const integerPropertyName1 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';

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
      .withCommonProperty(commonName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${namespaceName}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${namespaceName}.${commonName}`, 'Documentation', true, false)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${namespaceName}.${commonName}`)
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

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

  it('should have domain entity extension table', async () => {
    expect(await tableExists(table(extension, domainEntityExtensionName))).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityExtensionName))).toEqual([integerPropertyName2]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityExtensionName, integerPropertyName2)],
      [column(namespaceName, domainEntityName, integerPropertyName2)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have common table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + commonName))).toBe(true);
  });

  it('should have common property', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + commonName, integerPropertyName1);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + commonName))).toEqual([
      integerPropertyName2,
      integerPropertyName1,
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

  it('should have common extension table', async () => {
    expect(await tableExists(table(extension, commonExtensionName))).toBe(true);
  });

  it('should have common extension property', async () => {
    const optionalColumn: DatabaseColumn = column(extension, commonExtensionName, integerPropertyName3);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, commonExtensionName))).toEqual([
      integerPropertyName2,
      integerPropertyName1,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, commonExtensionName, integerPropertyName2)],
      [column(namespaceName, domainEntityName + commonName, integerPropertyName2)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});
