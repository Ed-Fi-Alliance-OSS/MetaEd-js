// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/MergePartOfReference/MergeStatementMustStartMergePathWithPropertyName';

describe('when validating reference property starts merge path with matching property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const entityName: string = 'DomainEntityPropertyName';
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringIdentityName', 'StringIdentityDocumentation', '100')
      .withDomainEntityProperty(entityName, 'DomainEntityPropertyDocumentation', true, false)
      .withMergePartOfReference(`${entityName}.Property`, 'TargetPropertyName')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating reference property starts merge path with mismatched property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringIdentityName', 'StringIdentityDocumentation', '100')
      .withDomainEntityProperty('DomainEntityPropertyName', 'DomainEntityPropertyDocumentation', true, false)
      .withMergePartOfReference('EntityName.PropertyName', 'TargetPropertyName')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MergeStatementMustStartMergePathWithPropertyName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating reference property starts merge path with mismatched property name should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating reference property starts merge path with mismatched property name should have validation failure -> sourceMap');
  });
});

describe('when validating reference property starts merge path with matching property name and context', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const entityName: string = 'DomainEntityPropertyName';
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringIdentityName', 'StringIdentityDocumentation', '100')
      .withDomainEntityProperty(entityName, 'DomainEntityPropertyDocumentation', true, false, false, entityName)
      .withMergePartOfReference(`${entityName}.Property`, 'TargetPropertyName')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating reference property starts merge path with property name and different context', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const entityName: string = 'DomainEntityPropertyName';
    const contextName: string = 'ContextName';
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringIdentityName', 'StringIdentityDocumentation', '100')
      .withDomainEntityProperty(entityName, 'DomainEntityPropertyDocumentation', true, false, false, contextName)
      .withMergePartOfReference(`${contextName}${entityName}.Property`, 'TargetPropertyName')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating reference property starts merge path with property name and missing context', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const entityName: string = 'DomainEntityPropertyName';
    const contextName: string = 'ContextName';
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringIdentityName', 'StringIdentityDocumentation', '100')
      .withDomainEntityProperty(entityName, 'DomainEntityPropertyDocumentation', true, false, false, contextName)
      .withMergePartOfReference(`${entityName}.Property`, 'TargetPropertyName')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MergeStatementMustStartMergePathWithPropertyName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating reference property starts merge path with property name and missing context should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating reference property starts merge path with property name and missing context should have validation failure -> sourceMap');
  });
});

