import { newMetaEdEnvironment, MetaEdTextBuilder, DomainBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Subdomain/SubdomainParentDomainNameMustMatchADomain';

describe('when validating subdomain entity parent domain name does match a domain', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName)
      .withDocumentation('doc')
      .withEndDomain()

      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withSubdomainPosition(1)
      .withFooterDocumentation('FooterDocumentation')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain and one subdomain entity', (): void => {
    expect(coreNamespace.entity.domain.size).toBe(1);
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating subdomain entity parent domain name does not match a domain', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain('DifferentDomain')
      .withDocumentation('doc')
      .withEndDomain()

      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withSubdomainPosition(1)
      .withFooterDocumentation('FooterDocumentation')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain and one subdomain entity', (): void => {
    expect(coreNamespace.entity.domain.size).toBe(1);
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SubdomainParentDomainNameMustMatchADomain');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
