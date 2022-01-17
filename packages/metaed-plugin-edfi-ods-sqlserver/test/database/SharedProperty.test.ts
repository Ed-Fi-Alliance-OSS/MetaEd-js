import {
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  SharedDecimalBuilder,
  SharedIntegerBuilder,
  SharedStringBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import {
  column,
  enhanceGenerateAndExecuteSql,
  table,
  testTearDown,
  columnDataTypes,
  testSuiteAfterAll,
} from './DatabaseTestBase';
import {
  columnExists,
  columnIsNullable,
  columnDataType,
  columnLength,
  columnPrecision,
  columnScale,
} from './DatabaseColumn';
import { tableExists } from './DatabaseTable';
import { DatabaseColumn } from './DatabaseColumn';

jest.setTimeout(40000);

afterAll(async () => testSuiteAfterAll());

describe('when entity has shared decimal property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const sharedPropertyName = 'SharedPropertyName';
  const totalDigits = 10;
  const decimalPlaces = 3;

  beforeAll(async () => {
    const sharedDecimalName = 'SharedDecimalName';

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedDecimal(sharedDecimalName)
      .withDocumentation('Documentation')
      .withDecimalRestrictions(totalDigits.toString(), decimalPlaces.toString())
      .withEndSharedDecimal()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName', 'Documentation')
      .withSharedDecimalProperty(sharedDecimalName, sharedPropertyName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have shared column', async () => {
    const sharedColumn: DatabaseColumn = column(namespaceName, domainEntityName, sharedPropertyName);
    expect(await columnExists(sharedColumn)).toBe(true);
    expect(await columnIsNullable(sharedColumn)).toBe(false);
    expect(await columnDataType(sharedColumn)).toBe(columnDataTypes.decimal);
    expect(await columnPrecision(sharedColumn)).toBe(totalDigits);
    expect(await columnScale(sharedColumn)).toBe(decimalPlaces);
  });
});

describe('when entity has shared integer property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const sharedPropertyName = 'SharedPropertyName';

  beforeAll(async () => {
    const sharedIntegerName = 'SharedIntegerName';

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedInteger(sharedIntegerName)
      .withDocumentation('Documentation')
      .withEndSharedInteger()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName', 'Documentation')
      .withSharedIntegerProperty(sharedIntegerName, sharedPropertyName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have shared column', async () => {
    const sharedColumn: DatabaseColumn = column(namespaceName, domainEntityName, sharedPropertyName);
    expect(await columnExists(sharedColumn)).toBe(true);
    expect(await columnIsNullable(sharedColumn)).toBe(false);
    expect(await columnDataType(sharedColumn)).toBe(columnDataTypes.integer);
  });
});

describe('when entity has shared short property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const sharedPropertyName = 'SharedPropertyName';

  beforeAll(async () => {
    const sharedShortName = 'SharedShortName';

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedShort(sharedShortName)
      .withDocumentation('Documentation')
      .withEndSharedShort()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withShortIdentity('ShortPropertyName', 'Documentation')
      .withSharedShortProperty(sharedShortName, sharedPropertyName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have shared column', async () => {
    const sharedColumn: DatabaseColumn = column(namespaceName, domainEntityName, sharedPropertyName);
    expect(await columnExists(sharedColumn)).toBe(true);
    expect(await columnIsNullable(sharedColumn)).toBe(false);
    expect(await columnDataType(sharedColumn)).toBe(columnDataTypes.smallint);
  });
});

describe('when entity has shared string property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const sharedPropertyName = 'SharedPropertyName';
  const maxLength = 50;

  beforeAll(async () => {
    const sharedStringName = 'SharedStringName';

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedString(sharedStringName)
      .withDocumentation('Documentation')
      .withMaxLength(maxLength.toString())
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName', 'Documentation')
      .withSharedStringProperty(sharedStringName, sharedPropertyName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have shared column', async () => {
    const sharedColumn: DatabaseColumn = column(namespaceName, domainEntityName, sharedPropertyName);
    expect(await columnExists(sharedColumn)).toBe(true);
    expect(await columnIsNullable(sharedColumn)).toBe(false);
    expect(await columnDataType(sharedColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(sharedColumn)).toBe(maxLength);
  });
});

describe('when entity has multiple shared properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const sharedPropertyName1 = 'SharedPropertyName1';
  const sharedPropertyName2 = 'SharedPropertyName2';
  const sharedPropertyName3 = 'SharedPropertyName3';
  const sharedPropertyName4 = 'SharedPropertyName4';
  const maxLength = 50;
  const totalDigits = 10;
  const decimalPlaces = 3;

  beforeAll(async () => {
    const sharedDecimalName = 'SharedDecimalName';
    const sharedIntegerName = 'SharedIntegerName';
    const sharedShortName = 'SharedShortName';
    const sharedStringName = 'SharedStringName';

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSharedDecimal(sharedDecimalName)
      .withDocumentation('Documentation')
      .withDecimalRestrictions(totalDigits.toString(), decimalPlaces.toString())
      .withEndSharedDecimal()

      .withStartSharedInteger(sharedIntegerName)
      .withDocumentation('Documentation')
      .withEndSharedInteger()

      .withStartSharedShort(sharedShortName)
      .withDocumentation('Documentation')
      .withEndSharedShort()

      .withStartSharedString(sharedStringName)
      .withDocumentation('Documentation')
      .withMaxLength(maxLength.toString())
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName', 'Documentation')
      .withSharedDecimalProperty(sharedDecimalName, sharedPropertyName1, 'Documentation', true, false)
      .withSharedIntegerProperty(sharedIntegerName, sharedPropertyName2, 'Documentation', true, false)
      .withSharedShortProperty(sharedShortName, sharedPropertyName3, 'Documentation', true, false)
      .withSharedStringProperty(sharedStringName, sharedPropertyName4, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have shared columns', async () => {
    const sharedDecimalColumn: DatabaseColumn = column(namespaceName, domainEntityName, sharedPropertyName1);
    expect(await columnExists(sharedDecimalColumn)).toBe(true);
    expect(await columnIsNullable(sharedDecimalColumn)).toBe(false);
    expect(await columnDataType(sharedDecimalColumn)).toBe(columnDataTypes.decimal);
    expect(await columnPrecision(sharedDecimalColumn)).toBe(totalDigits);
    expect(await columnScale(sharedDecimalColumn)).toBe(decimalPlaces);

    const sharedIntegerColumn: DatabaseColumn = column(namespaceName, domainEntityName, sharedPropertyName2);
    expect(await columnExists(sharedIntegerColumn)).toBe(true);
    expect(await columnIsNullable(sharedIntegerColumn)).toBe(false);
    expect(await columnDataType(sharedIntegerColumn)).toBe(columnDataTypes.integer);

    const sharedShortColumn: DatabaseColumn = column(namespaceName, domainEntityName, sharedPropertyName3);
    expect(await columnExists(sharedShortColumn)).toBe(true);
    expect(await columnIsNullable(sharedShortColumn)).toBe(false);
    expect(await columnDataType(sharedShortColumn)).toBe(columnDataTypes.smallint);

    const sharedStringColumn: DatabaseColumn = column(namespaceName, domainEntityName, sharedPropertyName4);
    expect(await columnExists(sharedStringColumn)).toBe(true);
    expect(await columnIsNullable(sharedStringColumn)).toBe(false);
    expect(await columnDataType(sharedStringColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(sharedStringColumn)).toBe(maxLength);
  });
});
