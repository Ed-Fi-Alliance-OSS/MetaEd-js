import {
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

describe('when domain entity extension has a common extension with a collection which overrides a collection of that common', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const coreCommon = 'CoreCommon';
  const coreDomainEntity = 'CoreDomainEntity';
  const domainEntityExtension = `${coreDomainEntity}Extension`;
  const commonExtensionPrefix = `${coreDomainEntity + coreCommon}`;
  const commonExtensionName = `${commonExtensionPrefix}Extension`;
  const coreDeIdentity = 'CoreDeIdentity';
  const coreCommonIdentity = 'CoreCommonIdentity';
  const scalarPlaceholder1 = 'ScalarPlaceholder1';
  const scalarPlaceholder2 = 'ScalarPlaceholder2';
  const collectionOnCommonExtension = 'CollectionOnCommonExtension';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(coreCommon)
      .withDocumentation('doc')
      .withIntegerIdentity(coreCommonIdentity, 'doc')
      .withEndCommon()

      .withStartDomainEntity(coreDomainEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(coreDeIdentity, 'doc')
      .withCommonProperty(coreCommon, 'doc', true, true) // required collection to override
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${coreDomainEntity}`)
      .withBooleanProperty(scalarPlaceholder1, 'doc', false, false) // forces table for DE Extension to exist
      .withCommonExtensionOverrideProperty(`${core}.${coreCommon}`, 'doc', true, true) // require collection override
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${coreCommon}`)
      .withIntegerProperty(collectionOnCommonExtension, 'doc', true, true) // additional collection on common
      .withBooleanProperty(scalarPlaceholder2, 'doc', false, false) // forces table for Common Extension to exist
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(core);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  // check core tables

  it('should have domain entity table', async () => {
    expect(await tableExists(table(core, coreDomainEntity))).toBe(true);
  });

  it('should have common table', async () => {
    expect(await tableExists(table(core, coreDomainEntity + coreCommon))).toBe(true);
  });

  it('should have property on common', async () => {
    const identityColumn: DatabaseColumn = column(core, coreDomainEntity + coreCommon, coreCommonIdentity);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys on common table', async () => {
    expect(await tablePrimaryKeys(table(core, coreDomainEntity + coreCommon))).toEqual([coreCommonIdentity, coreDeIdentity]);
  });

  it('should have correct foreign key relationship from common table to domain entity table', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(core, coreDomainEntity + coreCommon, coreDeIdentity)],
      [column(core, coreDomainEntity, coreDeIdentity)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  // check extension tables

  it('should have domain entity extension table', async () => {
    expect(await tableExists(table(extension, domainEntityExtension))).toBe(true);
  });

  it('should have scalar property on domain entity extension table', async () => {
    const optionalColumn: DatabaseColumn = column(extension, domainEntityExtension, scalarPlaceholder1);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have correct primary keys on domain entity extension table', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityExtension))).toEqual([coreDeIdentity]);
  });

  it('should have correct foreign key relationship from domain entity extension table to domain entity table', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityExtension, coreDeIdentity)],
      [column(core, coreDomainEntity, coreDeIdentity)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have common extension table', async () => {
    expect(await tableExists(table(extension, commonExtensionName))).toBe(true);
  });

  it('should have scalar property on common extension table', async () => {
    const optionalColumn: DatabaseColumn = column(extension, commonExtensionName, scalarPlaceholder2);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have correct primary keys on common extension table', async () => {
    expect(await tablePrimaryKeys(table(extension, commonExtensionName))).toEqual([coreCommonIdentity, coreDeIdentity]);
  });

  it('should have correct foreign key relationship from common extension table to common table', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, commonExtensionName, coreCommonIdentity), column(extension, commonExtensionName, coreDeIdentity)],
      [
        column(core, coreDomainEntity + coreCommon, coreCommonIdentity),
        column(core, coreDomainEntity + coreCommon, coreDeIdentity),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have common extension collection table', async () => {
    expect(await tableExists(table(extension, commonExtensionPrefix + collectionOnCommonExtension))).toBe(true);
  });

  it('should have collection property on common extension collection table', async () => {
    const optionalColumn: DatabaseColumn = column(
      extension,
      commonExtensionPrefix + collectionOnCommonExtension,
      collectionOnCommonExtension,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
  });

  it('should have correct primary keys on common extension collection table', async () => {
    expect(await tablePrimaryKeys(table(extension, commonExtensionPrefix + collectionOnCommonExtension))).toEqual([
      collectionOnCommonExtension,
      coreCommonIdentity,
      coreDeIdentity,
    ]);
  });

  it('should have correct foreign key relationship from common extension collection table to domain entity collection table', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(extension, commonExtensionPrefix + collectionOnCommonExtension, coreCommonIdentity),
        column(extension, commonExtensionPrefix + collectionOnCommonExtension, coreDeIdentity),
      ],
      [
        column(core, coreDomainEntity + coreCommon, coreCommonIdentity),
        column(core, coreDomainEntity + coreCommon, coreDeIdentity),
      ],
    );

    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when domain entity extension has only a common collection which is extended', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const coreCommon = 'CoreCommon';
  const coreDomainEntity = 'CoreDomainEntity';
  const domainEntityExtension = `${coreDomainEntity}Extension`;
  const commonExtensionPrefix = `${coreDomainEntity + coreCommon}`;
  const commonExtensionName = `${commonExtensionPrefix}Extension`;
  const coreDeIdentity = 'CoreDeIdentity';
  const coreCommonIdentity = 'CoreCommonIdentity';
  const scalarPlaceholder = 'ScalarPlaceholder2';
  const collectionOnCommonExtension = 'CollectionOnCommonExtension';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(coreCommon)
      .withDocumentation('doc')
      .withIntegerIdentity(coreCommonIdentity, 'doc')
      .withEndCommon()

      .withStartDomainEntity(coreDomainEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(coreDeIdentity, 'doc')
      .withCommonProperty(coreCommon, 'doc', true, true) // required collection to override
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${coreDomainEntity}`)
      .withCommonExtensionOverrideProperty(`${core}.${coreCommon}`, 'doc', true, true) // require collection override
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${coreCommon}`)
      .withIntegerProperty(collectionOnCommonExtension, 'doc', true, true) // additional collection on common
      .withBooleanProperty(scalarPlaceholder, 'doc', false, false) // forces table for Common Extension to exist
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(core);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  // check core tables

  it('should have domain entity table', async () => {
    expect(await tableExists(table(core, coreDomainEntity))).toBe(true);
  });

  it('should have common table', async () => {
    expect(await tableExists(table(core, coreDomainEntity + coreCommon))).toBe(true);
  });

  it('should have property on common', async () => {
    const identityColumn: DatabaseColumn = column(core, coreDomainEntity + coreCommon, coreCommonIdentity);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys on common table', async () => {
    expect(await tablePrimaryKeys(table(core, coreDomainEntity + coreCommon))).toEqual([coreCommonIdentity, coreDeIdentity]);
  });

  it('should have correct foreign key relationship from common table to domain entity table', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(core, coreDomainEntity + coreCommon, coreDeIdentity)],
      [column(core, coreDomainEntity, coreDeIdentity)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  // check extension tables

  it('should not have domain entity extension table', async () => {
    expect(await tableExists(table(extension, domainEntityExtension))).toBe(false);
  });

  it('should have common extension table', async () => {
    expect(await tableExists(table(extension, commonExtensionName))).toBe(true);
  });

  it('should have scalar property on common extension table', async () => {
    const optionalColumn: DatabaseColumn = column(extension, commonExtensionName, scalarPlaceholder);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
  });

  it('should have correct primary keys on common extension table', async () => {
    expect(await tablePrimaryKeys(table(extension, commonExtensionName))).toEqual([coreCommonIdentity, coreDeIdentity]);
  });

  it('should have correct foreign key relationship from common extension table to common table', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, commonExtensionName, coreCommonIdentity), column(extension, commonExtensionName, coreDeIdentity)],
      [
        column(core, coreDomainEntity + coreCommon, coreCommonIdentity),
        column(core, coreDomainEntity + coreCommon, coreDeIdentity),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  it('should have common extension collection table', async () => {
    expect(await tableExists(table(extension, commonExtensionPrefix + collectionOnCommonExtension))).toBe(true);
  });

  it('should have collection property on common extension collection table', async () => {
    const optionalColumn: DatabaseColumn = column(
      extension,
      commonExtensionPrefix + collectionOnCommonExtension,
      collectionOnCommonExtension,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
  });

  it('should have correct primary keys on common extension collection table', async () => {
    expect(await tablePrimaryKeys(table(extension, commonExtensionPrefix + collectionOnCommonExtension))).toEqual([
      collectionOnCommonExtension,
      coreCommonIdentity,
      coreDeIdentity,
    ]);
  });

  it('should have correct foreign key relationship from common extension collection table to domain entity collection table', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(extension, commonExtensionPrefix + collectionOnCommonExtension, coreCommonIdentity),
        column(extension, commonExtensionPrefix + collectionOnCommonExtension, coreDeIdentity),
      ],
      [
        column(core, coreDomainEntity + coreCommon, coreCommonIdentity),
        column(core, coreDomainEntity + coreCommon, coreDeIdentity),
      ],
    );

    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when domain entity extension has only a common collection - with only a collection - which is extended', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const coreCommon = 'CoreCommon';
  const coreDomainEntity = 'CoreDomainEntity';
  const domainEntityExtension = `${coreDomainEntity}Extension`;
  const commonExtensionPrefix = `${coreDomainEntity + coreCommon}`;
  const commonExtensionName = `${commonExtensionPrefix}Extension`;
  const coreDeIdentity = 'CoreDeIdentity';
  const coreCommonIdentity = 'CoreCommonIdentity';
  const collectionOnCommonExtension = 'CollectionOnCommonExtension';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(coreCommon)
      .withDocumentation('doc')
      .withIntegerIdentity(coreCommonIdentity, 'doc')
      .withEndCommon()

      .withStartDomainEntity(coreDomainEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(coreDeIdentity, 'doc')
      .withCommonProperty(coreCommon, 'doc', true, true) // required collection to override
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${coreDomainEntity}`)
      .withCommonExtensionOverrideProperty(`${core}.${coreCommon}`, 'doc', true, true) // require collection override
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${coreCommon}`)
      .withIntegerProperty(collectionOnCommonExtension, 'doc', true, true) // additional collection on common
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(core);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  // check core tables

  it('should have domain entity table', async () => {
    expect(await tableExists(table(core, coreDomainEntity))).toBe(true);
  });

  it('should have common table', async () => {
    expect(await tableExists(table(core, coreDomainEntity + coreCommon))).toBe(true);
  });

  it('should have property on common', async () => {
    const identityColumn: DatabaseColumn = column(core, coreDomainEntity + coreCommon, coreCommonIdentity);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
  });

  it('should have correct primary keys on common table', async () => {
    expect(await tablePrimaryKeys(table(core, coreDomainEntity + coreCommon))).toEqual([coreCommonIdentity, coreDeIdentity]);
  });

  it('should have correct foreign key relationship from common table to domain entity table', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(core, coreDomainEntity + coreCommon, coreDeIdentity)],
      [column(core, coreDomainEntity, coreDeIdentity)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });

  // check extension tables

  it('should not have domain entity extension table', async () => {
    expect(await tableExists(table(extension, domainEntityExtension))).toBe(false);
  });

  it('should not have common extension table', async () => {
    expect(await tableExists(table(extension, commonExtensionName))).toBe(false);
  });

  it('should have common extension collection table', async () => {
    expect(await tableExists(table(extension, commonExtensionPrefix + collectionOnCommonExtension))).toBe(true);
  });

  it('should have collection property on common extension collection table', async () => {
    const optionalColumn: DatabaseColumn = column(
      extension,
      commonExtensionPrefix + collectionOnCommonExtension,
      collectionOnCommonExtension,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
  });

  it('should have correct primary keys on common extension collection table', async () => {
    expect(await tablePrimaryKeys(table(extension, commonExtensionPrefix + collectionOnCommonExtension))).toEqual([
      collectionOnCommonExtension,
      coreCommonIdentity,
      coreDeIdentity,
    ]);
  });

  it('should have correct foreign key relationship from common extension collection table to domain entity collection table', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(extension, commonExtensionPrefix + collectionOnCommonExtension, coreCommonIdentity),
        column(extension, commonExtensionPrefix + collectionOnCommonExtension, coreDeIdentity),
      ],
      [
        column(core, coreDomainEntity + coreCommon, coreCommonIdentity),
        column(core, coreDomainEntity + coreCommon, coreDeIdentity),
      ],
    );

    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});
