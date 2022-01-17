import { DomainEntityBuilder, MetaEdTextBuilder, NamespaceBuilder, newMetaEdEnvironment } from '@edfi/metaed-core';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import {
  column,
  columnDataTypes,
  enhanceGenerateAndExecuteSql,
  foreignKey,
  table,
  testTearDown,
  testSuiteAfterAll,
} from './DatabaseTestBase';
import {
  columnDataType,
  columnExists,
  columnIsNullable,
  columnLength,
  columnMSDescription,
  columnPrecision,
  columnScale,
} from './DatabaseColumn';
import { foreignKeyDeleteCascades, foreignKeyExists } from './DatabaseForeignKey';
import { tableExists, tablePrimaryKeys, tableColumnCount } from './DatabaseTable';
import { DatabaseColumn } from './DatabaseColumn';
import { DatabaseForeignKey } from './DatabaseForeignKey';

jest.setTimeout(40000);

afterAll(async () => testSuiteAfterAll());

describe('when entity has identity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName = 'IntegerPropertyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, integerPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([integerPropertyName]);
  });
});

describe('when entity has multiple identity properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have identity column', async () => {
    const identityColumn1: DatabaseColumn = column(namespaceName, domainEntityName, integerPropertyName1);
    expect(await columnExists(identityColumn1)).toBe(true);
    expect(await columnIsNullable(identityColumn1)).toBe(false);
    expect(await columnDataType(identityColumn1)).toBe(columnDataTypes.integer);

    const identityColumn2: DatabaseColumn = column(namespaceName, domainEntityName, integerPropertyName2);
    expect(await columnExists(identityColumn2)).toBe(true);
    expect(await columnIsNullable(identityColumn2)).toBe(false);
    expect(await columnDataType(identityColumn2)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });
});

describe('when entity has decimal properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const optionalDecimalDocumentation = 'OptionalDecimalDocumentation';
  const optionalDecimalName = 'OptionalDecimalName';
  const requiredDecimalDocumentation = 'RequiredDecimalDocumentation';
  const requiredDecimalName = 'RequiredDecimalName';
  const totalDigits = 10;
  const decimalPlaces = 3;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withDecimalProperty(
        optionalDecimalName,
        optionalDecimalDocumentation,
        false,
        false,
        totalDigits.toString(),
        decimalPlaces.toString(),
        null,
        null,
        contextName,
      )
      .withDecimalProperty(
        requiredDecimalName,
        requiredDecimalDocumentation,
        true,
        false,
        totalDigits.toString(),
        decimalPlaces.toString(),
      )
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + optionalDecimalName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.decimal);
    expect(await columnPrecision(optionalColumn)).toBe(totalDigits);
    expect(await columnScale(optionalColumn)).toBe(decimalPlaces);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalDecimalDocumentation);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredDecimalName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.decimal);
    expect(await columnPrecision(requiredColumn)).toBe(totalDigits);
    expect(await columnScale(requiredColumn)).toBe(decimalPlaces);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredDecimalDocumentation);
  });
});

describe('when entity has collection decimal properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const optionalDecimalDocumentation = 'OptionalDecimalDocumentation';
  const optionalDecimalName = 'OptionalDecimalName';
  const requiredDecimalDocumentation = 'RequiredDecimalDocumentation';
  const requiredDecimalName = 'RequiredDecimalName';
  const totalDigits = 10;
  const decimalPlaces = 3;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withDecimalProperty(
        optionalDecimalName,
        optionalDecimalDocumentation,
        false,
        true,
        totalDigits.toString(),
        decimalPlaces.toString(),
        null,
        null,
        contextName,
      )
      .withDecimalProperty(
        requiredDecimalName,
        requiredDecimalDocumentation,
        true,
        true,
        totalDigits.toString(),
        decimalPlaces.toString(),
      )
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
    expect(await tableColumnCount(table(namespaceName, domainEntityName))).toBe(4);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have optional collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName + optionalDecimalName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalDecimalName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalDecimalName,
      optionalDecimalName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.decimal);
    expect(await columnPrecision(optionalColumn)).toBe(totalDigits);
    expect(await columnScale(optionalColumn)).toBe(decimalPlaces);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalDecimalDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName + optionalDecimalName))).toEqual([
      identityPropertyName,
      optionalDecimalName,
    ]);
  });

  it('should have required collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + requiredDecimalName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredDecimalName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredDecimalName,
      requiredDecimalName,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.decimal);
    expect(await columnPrecision(requiredColumn)).toBe(totalDigits);
    expect(await columnScale(requiredColumn)).toBe(decimalPlaces);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredDecimalDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + requiredDecimalName))).toEqual([
      identityPropertyName,
      requiredDecimalName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName + optionalDecimalName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + requiredDecimalName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});

describe('when entity has boolean properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const optionalBooleanDocumentation = 'OptionalBooleanDocumentation';
  const optionalBooleanName = 'OptionalBooleanName';
  const requiredBooleanDocumentation = 'RequiredBooleanDocumentation';
  const requiredBooleanName = 'RequiredBooleanName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withBooleanProperty(optionalBooleanName, optionalBooleanDocumentation, false, false, contextName)
      .withBooleanProperty(requiredBooleanName, requiredBooleanDocumentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + optionalBooleanName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.bit);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalBooleanDocumentation);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredBooleanName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.bit);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredBooleanDocumentation);
  });
});

describe('when entity has collection boolean properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const optionalBooleanDocumentation = 'OptionalBooleanDocumentation';
  const optionalBooleanName = 'OptionalBooleanName';
  const requiredBooleanDocumentation = 'RequiredBooleanDocumentation';
  const requiredBooleanName = 'RequiredBooleanName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withBooleanProperty(optionalBooleanName, optionalBooleanDocumentation, false, true, contextName)
      .withBooleanProperty(requiredBooleanName, requiredBooleanDocumentation, true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
    expect(await tableColumnCount(table(namespaceName, domainEntityName))).toBe(4);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have optional collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName + optionalBooleanName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalBooleanName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalBooleanName,
      optionalBooleanName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.bit);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalBooleanDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName + optionalBooleanName))).toEqual([
      identityPropertyName,
      optionalBooleanName,
    ]);
  });

  it('should have required collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + requiredBooleanName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredBooleanName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredBooleanName,
      requiredBooleanName,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.bit);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredBooleanDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + requiredBooleanName))).toEqual([
      identityPropertyName,
      requiredBooleanName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName + optionalBooleanName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + requiredBooleanName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});

describe('when entity has currency properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const optionalCurrencyDocumentation = 'OptionalCurrencyDocumentation';
  const optionalCurrencyName = 'OptionalCurrencyName';
  const requiredCurrencyDocumentation = 'RequiredCurrencyDocumentation';
  const requiredCurrencyName = 'RequiredCurrencyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withCurrencyProperty(optionalCurrencyName, optionalCurrencyDocumentation, false, false, contextName)
      .withCurrencyProperty(requiredCurrencyName, requiredCurrencyDocumentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + optionalCurrencyName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.money);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalCurrencyDocumentation);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredCurrencyName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.money);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredCurrencyDocumentation);
  });
});

describe('when entity has collection currency properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const optionalCurrencyDocumentation = 'OptionalCurrencyDocumentation';
  const optionalCurrencyName = 'OptionalCurrencyName';
  const requiredCurrencyDocumentation = 'RequiredCurrencyDocumentation';
  const requiredCurrencyName = 'RequiredCurrencyName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withCurrencyProperty(optionalCurrencyName, optionalCurrencyDocumentation, false, true, contextName)
      .withCurrencyProperty(requiredCurrencyName, requiredCurrencyDocumentation, true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
    expect(await tableColumnCount(table(namespaceName, domainEntityName))).toBe(4);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have optional collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName + optionalCurrencyName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalCurrencyName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalCurrencyName,
      optionalCurrencyName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.money);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalCurrencyDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName + optionalCurrencyName))).toEqual([
      identityPropertyName,
      optionalCurrencyName,
    ]);
  });

  it('should have required collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + requiredCurrencyName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredCurrencyName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredCurrencyName,
      requiredCurrencyName,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.money);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredCurrencyDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + requiredCurrencyName))).toEqual([
      identityPropertyName,
      requiredCurrencyName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName + optionalCurrencyName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + requiredCurrencyName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});

describe('when entity has date properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const optionalDateDocumentation = 'OptionalDateDocumentation';
  const optionalDateName = 'OptionalDateName';
  const requiredDateDocumentation = 'RequiredDateDocumentation';
  const requiredDateName = 'RequiredDateName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withDateProperty(optionalDateName, optionalDateDocumentation, false, false, contextName)
      .withDateProperty(requiredDateName, requiredDateDocumentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + optionalDateName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.date);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalDateDocumentation);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredDateName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.date);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredDateDocumentation);
  });
});

describe('when entity has collection date properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const optionalDateDocumentation = 'OptionalDateDocumentation';
  const optionalDateName = 'OptionalDateName';
  const requiredDateDocumentation = 'RequiredDateDocumentation';
  const requiredDateName = 'RequiredDateName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withDateProperty(optionalDateName, optionalDateDocumentation, false, true, contextName)
      .withDateProperty(requiredDateName, requiredDateDocumentation, true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
    expect(await tableColumnCount(table(namespaceName, domainEntityName))).toBe(4);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have optional collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName + optionalDateName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalDateName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalDateName,
      optionalDateName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.date);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalDateDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName + optionalDateName))).toEqual([
      identityPropertyName,
      optionalDateName,
    ]);
  });

  it('should have required collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + requiredDateName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + requiredDateName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName + requiredDateName, requiredDateName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.date);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredDateDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + requiredDateName))).toEqual([
      identityPropertyName,
      requiredDateName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName + optionalDateName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + requiredDateName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});

describe('when entity has datetime properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const optionalDatetimeDocumentation = 'OptionalDatetimeDocumentation';
  const optionalDatetimeName = 'OptionalDatetimeName';
  const requiredDatetimeDocumentation = 'RequiredDatetimeDocumentation';
  const requiredDatetimeName = 'RequiredDatetimeName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withDatetimeProperty(optionalDatetimeName, optionalDatetimeDocumentation, false, false, contextName)
      .withDatetimeProperty(requiredDatetimeName, requiredDatetimeDocumentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + optionalDatetimeName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.datetime2);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalDatetimeDocumentation);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredDatetimeName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.datetime2);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredDatetimeDocumentation);
  });
});

describe('when entity has collection datetime properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const optionalDatetimeDocumentation = 'OptionalDatetimeDocumentation';
  const optionalDatetimeName = 'OptionalDatetimeName';
  const requiredDatetimeDocumentation = 'RequiredDatetimeDocumentation';
  const requiredDatetimeName = 'RequiredDatetimeName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withDatetimeProperty(optionalDatetimeName, optionalDatetimeDocumentation, false, true, contextName)
      .withDatetimeProperty(requiredDatetimeName, requiredDatetimeDocumentation, true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
    expect(await tableColumnCount(table(namespaceName, domainEntityName))).toBe(4);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have optional collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName + optionalDatetimeName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalDatetimeName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalDatetimeName,
      optionalDatetimeName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.datetime2);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalDatetimeDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName + optionalDatetimeName))).toEqual([
      identityPropertyName,
      optionalDatetimeName,
    ]);
  });

  it('should have required collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + requiredDatetimeName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredDatetimeName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredDatetimeName,
      requiredDatetimeName,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.datetime2);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredDatetimeDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + requiredDatetimeName))).toEqual([
      identityPropertyName,
      requiredDatetimeName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName + optionalDatetimeName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + requiredDatetimeName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});

describe('when entity has duration properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const optionalDurationDocumentation = 'OptionalDurationDocumentation';
  const optionalDurationName = 'OptionalDurationName';
  const requiredDurationDocumentation = 'RequiredDurationDocumentation';
  const requiredDurationName = 'RequiredDurationName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withDurationProperty(optionalDurationName, optionalDurationDocumentation, false, false, contextName)
      .withDurationProperty(requiredDurationName, requiredDurationDocumentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + optionalDurationName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalDurationDocumentation);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredDurationName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredDurationDocumentation);
  });
});

describe('when entity has collection duration properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const optionalDurationDocumentation = 'OptionalDurationDocumentation';
  const optionalDurationName = 'OptionalDurationName';
  const requiredDurationDocumentation = 'RequiredDurationDocumentation';
  const requiredDurationName = 'RequiredDurationName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withDurationProperty(optionalDurationName, optionalDurationDocumentation, false, true, contextName)
      .withDurationProperty(requiredDurationName, requiredDurationDocumentation, true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
    expect(await tableColumnCount(table(namespaceName, domainEntityName))).toBe(4);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have optional collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName + optionalDurationName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalDurationName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalDurationName,
      optionalDurationName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalDurationDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName + optionalDurationName))).toEqual([
      identityPropertyName,
      optionalDurationName,
    ]);
  });

  it('should have required collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + requiredDurationName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredDurationName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredDurationName,
      requiredDurationName,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredDurationDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + requiredDurationName))).toEqual([
      identityPropertyName,
      requiredDurationName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName + optionalDurationName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + requiredDurationName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});

describe('when entity has percent properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const optionalPercentDocumentation = 'OptionalPercentDocumentation';
  const optionalPercentName = 'OptionalPercentName';
  const requiredPercentDocumentation = 'RequiredPercentDocumentation';
  const requiredPercentName = 'RequiredPercentName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withPercentProperty(optionalPercentName, optionalPercentDocumentation, false, false, contextName)
      .withPercentProperty(requiredPercentName, requiredPercentDocumentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + optionalPercentName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.decimal);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalPercentDocumentation);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredPercentName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.decimal);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredPercentDocumentation);
  });
});

describe('when entity has collection percent properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const optionalPercentDocumentation = 'OptionalPercentDocumentation';
  const optionalPercentName = 'OptionalPercentName';
  const requiredPercentDocumentation = 'RequiredPercentDocumentation';
  const requiredPercentName = 'RequiredPercentName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withPercentProperty(optionalPercentName, optionalPercentDocumentation, false, true, contextName)
      .withPercentProperty(requiredPercentName, requiredPercentDocumentation, true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
    expect(await tableColumnCount(table(namespaceName, domainEntityName))).toBe(4);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have optional collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName + optionalPercentName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalPercentName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalPercentName,
      optionalPercentName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.decimal);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalPercentDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName + optionalPercentName))).toEqual([
      identityPropertyName,
      optionalPercentName,
    ]);
  });

  it('should have required collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + requiredPercentName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredPercentName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const requiredColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredPercentName,
      requiredPercentName,
    );
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.decimal);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredPercentDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + requiredPercentName))).toEqual([
      identityPropertyName,
      requiredPercentName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName + optionalPercentName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + requiredPercentName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});

describe('when entity has short properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const optionalShortDocumentation = 'OptionalShortDocumentation';
  const optionalShortName = 'OptionalShortName';
  const requiredShortDocumentation = 'RequiredShortDocumentation';
  const requiredShortName = 'RequiredShortName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withShortProperty(optionalShortName, optionalShortDocumentation, false, false, null, null, contextName)
      .withShortProperty(requiredShortName, requiredShortDocumentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + optionalShortName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.smallint);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalShortDocumentation);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredShortName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.smallint);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredShortDocumentation);
  });
});

describe('when entity has collection short properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const optionalShortDocumentation = 'OptionalShortDocumentation';
  const optionalShortName = 'OptionalShortName';
  const requiredShortDocumentation = 'RequiredShortDocumentation';
  const requiredShortName = 'RequiredShortName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withShortProperty(optionalShortName, optionalShortDocumentation, false, true, null, null, contextName)
      .withShortProperty(requiredShortName, requiredShortDocumentation, true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
    expect(await tableColumnCount(table(namespaceName, domainEntityName))).toBe(4);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have optional collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName + optionalShortName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalShortName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalShortName,
      optionalShortName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.smallint);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalShortDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName + optionalShortName))).toEqual([
      identityPropertyName,
      optionalShortName,
    ]);
  });

  it('should have required collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + requiredShortName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + requiredShortName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName + requiredShortName, requiredShortName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.smallint);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredShortDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + requiredShortName))).toEqual([
      identityPropertyName,
      requiredShortName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName + optionalShortName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + requiredShortName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});

describe('when entity has string properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const optionalStringDocumentation = 'OptionalStringDocumentation';
  const optionalStringName = 'OptionalStringName';
  const requiredStringDocumentation = 'RequiredStringDocumentation';
  const requiredStringName = 'RequiredStringName';
  const maxLength1 = 25;
  const maxLength2 = 50;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withStringProperty(
        optionalStringName,
        optionalStringDocumentation,
        false,
        false,
        maxLength1.toString(),
        '1',
        contextName,
      )
      .withStringProperty(requiredStringName, requiredStringDocumentation, true, false, maxLength2.toString(), '1')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + optionalStringName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(optionalColumn)).toBe(maxLength1);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalStringDocumentation);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredStringName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(requiredColumn)).toBe(maxLength2);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredStringDocumentation);
  });
});

describe('when entity has collection string properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const optionalStringDocumentation = 'OptionalStringDocumentation';
  const optionalStringName = 'OptionalStringName';
  const requiredStringDocumentation = 'RequiredStringDocumentation';
  const requiredStringName = 'RequiredStringName';
  const maxLength1 = 25;
  const maxLength2 = 50;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withStringProperty(
        optionalStringName,
        optionalStringDocumentation,
        false,
        true,
        maxLength1.toString(),
        '1',
        contextName,
      )
      .withStringProperty(requiredStringName, requiredStringDocumentation, true, true, maxLength2.toString(), '1')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
    expect(await tableColumnCount(table(namespaceName, domainEntityName))).toBe(4);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have optional collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName + optionalStringName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalStringName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalStringName,
      optionalStringName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(optionalColumn)).toBe(maxLength1);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalStringDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName + optionalStringName))).toEqual([
      identityPropertyName,
      optionalStringName,
    ]);
  });

  it('should have required collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + requiredStringName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + requiredStringName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName + requiredStringName, requiredStringName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(requiredColumn)).toBe(maxLength2);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredStringDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + requiredStringName))).toEqual([
      identityPropertyName,
      requiredStringName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName + optionalStringName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + requiredStringName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});

describe('when entity has time properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const optionalTimeDocumentation = 'OptionalTimeDocumentation';
  const optionalTimeName = 'OptionalTimeName';
  const requiredTimeDocumentation = 'RequiredTimeDocumentation';
  const requiredTimeName = 'RequiredTimeName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withTimeProperty(optionalTimeName, optionalTimeDocumentation, false, false, contextName)
      .withTimeProperty(requiredTimeName, requiredTimeDocumentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + optionalTimeName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.time);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalTimeDocumentation);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredTimeName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.time);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredTimeDocumentation);
  });
});

describe('when entity has collection time properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const optionalTimeDocumentation = 'OptionalTimeDocumentation';
  const optionalTimeName = 'OptionalTimeName';
  const requiredTimeDocumentation = 'RequiredTimeDocumentation';
  const requiredTimeName = 'RequiredTimeName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withTimeProperty(optionalTimeName, optionalTimeDocumentation, false, true, contextName)
      .withTimeProperty(requiredTimeName, requiredTimeDocumentation, true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
    expect(await tableColumnCount(table(namespaceName, domainEntityName))).toBe(4);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have optional collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName + optionalTimeName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalTimeName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalTimeName,
      optionalTimeName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.time);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalTimeDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName + optionalTimeName))).toEqual([
      identityPropertyName,
      optionalTimeName,
    ]);
  });

  it('should have required collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + requiredTimeName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + requiredTimeName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName + requiredTimeName, requiredTimeName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.time);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredTimeDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + requiredTimeName))).toEqual([
      identityPropertyName,
      requiredTimeName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName + optionalTimeName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + requiredTimeName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});

describe('when entity has year properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const optionalYearDocumentation = 'OptionalYearDocumentation';
  const optionalYearName = 'OptionalYearName';
  const requiredYearDocumentation = 'RequiredYearDocumentation';
  const requiredYearName = 'RequiredYearName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withYearProperty(optionalYearName, optionalYearDocumentation, false, false, contextName)
      .withYearProperty(requiredYearName, requiredYearDocumentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const optionalColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + optionalYearName);
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(true);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.smallint);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalYearDocumentation);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName, requiredYearName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.smallint);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredYearDocumentation);
  });
});

describe('when entity has collection year properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const identityPropertyName = 'IdentityPropertyName';
  const optionalYearDocumentation = 'OptionalYearDocumentation';
  const optionalYearName = 'OptionalYearName';
  const requiredYearDocumentation = 'RequiredYearDocumentation';
  const requiredYearName = 'RequiredYearName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(identityPropertyName, 'Documentation')
      .withYearProperty(optionalYearName, optionalYearDocumentation, false, true, contextName)
      .withYearProperty(requiredYearName, requiredYearDocumentation, true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
    expect(await tableColumnCount(table(namespaceName, domainEntityName))).toBe(4);
  });

  it('should have identity column', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);
  });

  it('should have optional collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + contextName + optionalYearName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalYearName,
      identityPropertyName,
    );
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const optionalColumn: DatabaseColumn = column(
      namespaceName,
      domainEntityName + contextName + optionalYearName,
      optionalYearName,
    );
    expect(await columnExists(optionalColumn)).toBe(true);
    expect(await columnIsNullable(optionalColumn)).toBe(false);
    expect(await columnDataType(optionalColumn)).toBe(columnDataTypes.smallint);
    expect(await columnMSDescription(optionalColumn)).toBe(optionalYearDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + contextName + optionalYearName))).toEqual([
      identityPropertyName,
      optionalYearName,
    ]);
  });

  it('should have required collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + requiredYearName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const identityColumn: DatabaseColumn = column(namespaceName, domainEntityName + requiredYearName, identityPropertyName);
    expect(await columnExists(identityColumn)).toBe(true);
    expect(await columnIsNullable(identityColumn)).toBe(false);
    expect(await columnDataType(identityColumn)).toBe(columnDataTypes.integer);

    const requiredColumn: DatabaseColumn = column(namespaceName, domainEntityName + requiredYearName, requiredYearName);
    expect(await columnExists(requiredColumn)).toBe(true);
    expect(await columnIsNullable(requiredColumn)).toBe(false);
    expect(await columnDataType(requiredColumn)).toBe(columnDataTypes.smallint);
    expect(await columnMSDescription(requiredColumn)).toBe(requiredYearDocumentation);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName + requiredYearName))).toEqual([
      identityPropertyName,
      requiredYearName,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + contextName + optionalYearName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + requiredYearName, identityPropertyName)],
      [column(namespaceName, domainEntityName, identityPropertyName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(true);
  });
});
