// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, CommonBuilder, DomainEntityBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/CommonProperty/CommonPropertyMustNotContainIdentity';

describe('when validating common property is part of identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon('EntityName1')
      .withDocumentation('EntityDocumentation')
      .withStringProperty('PropertyName1', 'PropertyDocumentation', true, false, '100')
      .withEndCommon()

      .withStartDomainEntity('EntityName2')
      .withDocumentation('EntityDocumentation')
      .withCommonIdentity('EntityName', 'PropertyDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failure for property', () => {
    expect(failures[0].validatorName).toBe('CommonPropertyMustNotContainIdentity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating common property has primary key should have validation failures -> message ');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common property has primary key should have validation failures -> sourceMap');
  });
});

