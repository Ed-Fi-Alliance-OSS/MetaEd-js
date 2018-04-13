// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  IntegerTypeBuilder,
  StringTypeBuilder,
  DecimalTypeBuilder,
  NamespaceInfoBuilder,
  SharedDecimalBuilder,
  SharedIntegerBuilder,
  SharedStringBuilder,
} from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/CrossSimpleProperty/SimplePropertiesCannotDuplicateNames';

describe('when two integer properties in different DEs have the same name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities, and one integer property', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.integer.length).toBe(2);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);
  });
});

describe('when an integer property and a decimal property in different DEs have the same name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DecimalTypeBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities, one integer property, one decimal property', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.integer.length).toBe(1);
    expect(metaEd.propertyIndex.decimal.length).toBe(1);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);
  });
});

describe('when a integer property and a string property in different DEs have the same name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new StringTypeBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities, one integer property, one string property', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.integer.length).toBe(1);
    expect(metaEd.propertyIndex.string.length).toBe(1);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);
  });
});
describe('when an string property and a string property in different DEs have the same name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new StringTypeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities, two string properties', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.string.length).toBe(2);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);
  });
});
describe('when an string property and a decimal property in different DEs have the same name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DecimalTypeBuilder(metaEd, []))
      .sendToListener(new StringTypeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities, one string property, one decimal property', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.string.length).toBe(1);
    expect(metaEd.propertyIndex.decimal.length).toBe(1);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);
  });
});

describe('when an decimal property and a decimal property in different DEs have the same name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DecimalTypeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities, two decimal properties', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.decimal.length).toBe(2);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);
  });
});

describe('when a decimal property and a shared decimal property in different DEs have the same name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedDecimalProperty(propertyName, null, 'doc', true, false)
      .withEndDomainEntity()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DecimalTypeBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities, one shared decimal, one decimal property', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.decimal.length).toBe(1);
    expect(metaEd.propertyIndex.sharedDecimal.length).toBe(1);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);
  });
});
describe('when a string property and a shared string property in different DEs have the same name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedStringProperty(propertyName, null, 'doc', true, false)
      .withEndDomainEntity()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new StringTypeBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities, one shared string, one string property', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.string.length).toBe(1);
    expect(metaEd.propertyIndex.sharedString.length).toBe(1);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);
  });
});

describe('when an integer property and a shared integer property in different DEs have the same name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedIntegerProperty(propertyName, null, 'doc', true, false)
      .withEndDomainEntity()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities, one shared integer, one integer property', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.integer.length).toBe(1);
    expect(metaEd.propertyIndex.sharedInteger.length).toBe(1);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);
  });
});
describe('when a short property and a shared short property in different DEs have the same name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withShortProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedShortProperty(propertyName, null, 'doc', true, false)
      .withEndDomainEntity()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities, one shared short, one short property', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.short.length).toBe(1);
    expect(metaEd.propertyIndex.sharedShort.length).toBe(1);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);
  });
});

describe('when a string property and a shared decimal property in different DEs have the same name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedDecimalProperty(propertyName, null, 'doc', true, false)
      .withEndDomainEntity()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities, one shared string, one string property', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.string.length).toBe(1);
    expect(metaEd.propertyIndex.sharedDecimal.length).toBe(1);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);
  });
});
