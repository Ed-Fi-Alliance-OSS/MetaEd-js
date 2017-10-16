// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainBuilder, CommonBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/Domain/CommonDomainItemMustMatchTopLevelEntity';

describe('when validating common domain item matches top level entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName: string = 'DomainName';
  const commonName: string = 'CommonName';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withCommonDomainItem(commonName)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating common domain item does not match top level entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName: string = 'DomainName';
  const commonName: string = 'CommonName';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withCommonDomainItem('CommonDomainItemName')
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should have one validation failure()', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('CommonDomainItemMustMatchTopLevelEntity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when common domain item has no matching top level entity should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when common domain item has no matching top level entity should have validation failure -> sourceMap');
  });
});
