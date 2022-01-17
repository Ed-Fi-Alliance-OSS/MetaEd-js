import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  SharedStringBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/StringProperty/StringPropertyMustNotMatchASharedString';

describe('when validating string property does not match shared string', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const maxLength = '10';
  const minLength = '0';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedString('SharedString')
      .withDocumentation('doc')
      .withEndSharedString()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', maxLength, minLength)
      .withStringProperty('StringProperty', 'doc', true, false, maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one abstract entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating string identity matches shared string', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const stringProperty = 'StringProperty';
  const minLength = '0';
  const maxLength = '10';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedString(stringProperty)
      .withDocumentation('doc')
      .withEndSharedString()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withStringIdentity(stringProperty, 'doc', maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one abstract entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('StringPropertyMustNotMatchASharedString');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when validating string property matches shared string', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const stringProperty = 'StringProperty';
  const minLength = '0';
  const maxLength = '10';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedString(stringProperty)
      .withDocumentation('doc')
      .withEndSharedString()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withStringProperty(stringProperty, 'doc', true, false, maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one abstract entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('StringPropertyMustNotMatchASharedString');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
