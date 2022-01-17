import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  CommonBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/CommonProperty/CommonPropertyMustNotContainIdentity';

describe('when validating common property is part of identity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon('EntityName1')
      .withDocumentation('EntityDocumentation')
      .withStringProperty('PropertyName1', 'PropertyDocumentation', true, false, '100')
      .withEndCommon()

      .withStartDomainEntity('EntityName2')
      .withDocumentation('EntityDocumentation')
      .withCommonIdentity('EntityName', 'PropertyDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build one common', (): void => {
    expect(coreNamespace.entity.common.size).toBe(1);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failure for property', (): void => {
    expect(failures[0].validatorName).toBe('CommonPropertyMustNotContainIdentity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
