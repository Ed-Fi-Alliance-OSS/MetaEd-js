// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainBuilder, NamespaceInfoBuilder } from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/Subdomain/SubdomainParentDomainNameMustMatchADomain';

describe('when validating subdomain entity parent domain name does match a domain', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName: string = 'DomainName';
  const subdomainName: string = 'SubdomainName';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName)
      .withDocumentation('doc')
      .withEndDomain()

      .withStartSubdomain(subdomainName, domainName, '1')
      .withDocumentation('doc')
      .withSubdomainPosition(1)
      .withFooterDocumentation('FooterDocumentation')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain and one subdomain entity', () => {
    expect(metaEd.entity.domain.size).toBe(1);
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating subdomain entity parent domain name does not match a domain', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName: string = 'DomainName';
  const subdomainName: string = 'SubdomainName';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain('DifferentDomain')
      .withDocumentation('doc')
      .withEndDomain()

      .withStartSubdomain(subdomainName, domainName, '1')
      .withDocumentation('doc')
      .withSubdomainPosition(1)
      .withFooterDocumentation('FooterDocumentation')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain and one subdomain entity', () => {
    expect(metaEd.entity.domain.size).toBe(1);
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SubdomainParentDomainNameMustMatchADomain');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when subdomain entity parent domain name does not match a domain should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when subdomain entity parent domain name does not match a domain should have validation failure -> sourceMap',
    );
  });
});
