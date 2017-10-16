// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, SharedStringBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/IntegerProperty/IntegerPropertyMustNotMatchACommonString';

describe('when validating integer property does not match common string', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi', 'ProjectExtension')
      .withStartSharedString('EntityName1')
      .withDocumentation('EntityDocumentation')
      .withEndSharedString()

      .withStartAbstractEntity('EntityName2')
      .withDocumentation('EntityDocumentation')
      .withIntegerIdentity('PropertyName', 'PropertyDocumentation', '10', '2')
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared string', () => {
    expect(metaEd.entity.sharedString.size).toBe(1);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating integer property matches common string', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi', 'ProjectExtension')
      .withStartSharedString(entityName)
      .withDocumentation('EntityDocumentation')
      .withEndSharedString()

      .withStartAbstractEntity('EntityName')
      .withDocumentation('EntityDocumentation')
      .withIntegerIdentity(entityName, 'PropertyDocumentation', '10', '2', '0', '10')
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared string', () => {
    expect(metaEd.entity.sharedString.size).toBe(1);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('IntegerPropertyMustNotMatchACommonString');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating integer property matches common string -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating integer property matches common string -> sourceMap');
  });
});
