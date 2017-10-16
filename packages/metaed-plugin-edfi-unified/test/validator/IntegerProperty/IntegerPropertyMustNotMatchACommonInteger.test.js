// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, SharedIntegerBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/IntegerProperty/IntegerPropertyMustNotMatchACommonInteger';

describe('when validating integer property does not match common integer', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedInteger('EntityName')
      .withDocumentation('EntityDocumentation')
      .withEndSharedInteger()

      .withStartAbstractEntity('EntityName')
      .withDocumentation('EntityDocumentation')
      .withIntegerIdentity('PropertyName', 'PropertyDocumentation', '10', '2', '0', '10')
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating integer property matches common integer', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedInteger(entityName)
      .withDocumentation('doc')
      .withEndSharedInteger()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withIntegerIdentity(entityName, 'PropertyDocumentation', '10', '2', '0', '10')
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('IntegerPropertyMustNotMatchACommonInteger');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating integer property matches common integer -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating integer property matches common integer -> sourceMap');
  });
});
