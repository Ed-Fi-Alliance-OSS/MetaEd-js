import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
  SharedDecimalBuilder,
  SharedIntegerBuilder,
  SharedStringBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/CrossSimpleProperty/SimplePropertiesCannotReuseEntitySharedTypeNames';

describe('when building shared integer with duplicate integer property in core namespace', (): void => {
  let failures: ValidationFailure[] = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withIntegerProperty(entityName, documentation, true, false, maxValue, minValue)
      .withEndDomainEntity()

      .withStartSharedInteger(entityName)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));
    failures = validate(metaEd);
  });

  it('should build one integer property', (): void => {
    expect(metaEd.propertyIndex.integer.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures[0].validatorName).toBe('SimplePropertiesCannotReuseEntitySharedTypeNames');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();

    expect(failures[1].validatorName).toBe('SimplePropertiesCannotReuseEntitySharedTypeNames');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});

describe('when building shared integer with duplicate integer property in extension namespace', (): void => {
  let failures: ValidationFailure[] = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withIntegerProperty(entityName, documentation, true, false, maxValue, minValue)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartSharedInteger(entityName)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one integer property', (): void => {
    expect(metaEd.propertyIndex.integer.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when building shared decimal with duplicate decimal property in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[] = [];

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withDecimalProperty(entityName, documentation, true, false, totalDigits, decimalPlaces, minValue, maxValue)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()

      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one decimal property', (): void => {
    expect(metaEd.propertyIndex.decimal.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when building shared string with duplicate string property in extension namespace reversed', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[] = [];

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';

  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withStringProperty(entityName, documentation, true, false, minLength, maxLength)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one string property', (): void => {
    expect(metaEd.propertyIndex.string.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when building shared string with duplicate integer property in core namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[] = [];

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()

      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withIntegerProperty(entityName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one integer property', (): void => {
    expect(metaEd.propertyIndex.integer.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures[0].validatorName).toBe('SimplePropertiesCannotReuseEntitySharedTypeNames');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();

    expect(failures[1].validatorName).toBe('SimplePropertiesCannotReuseEntitySharedTypeNames');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});
