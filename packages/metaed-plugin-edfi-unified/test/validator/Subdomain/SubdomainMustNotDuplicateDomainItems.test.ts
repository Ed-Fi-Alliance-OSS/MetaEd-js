import { newMetaEdEnvironment, MetaEdTextBuilder, DomainBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Subdomain/SubdomainMustNotDuplicateDomainItems';

describe('when validating subdomain entity domain item does not duplicate domain items', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem('DomainItem1')
      .withDomainEntityDomainItem('DomainItem2')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain entity', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should build two domain entity domain items', (): void => {
    const subdomain = coreNamespace.entity.subdomain.get(subdomainName);
    expect(subdomain).toBeDefined();
    if (subdomain !== undefined) {
      expect(subdomain.domainItems.length).toBe(2);
    }
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating subdomain entity domain item has duplicate domain items', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const domainEntityName = 'DomainEntityName';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain entity', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SubdomainMustNotDuplicateDomainItems');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when validating subdomain entity domain item has multiple duplicate domain items', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const subdomainName = 'SubdomainName';
  const domainEntityName = 'DomainEntityName';
  const domainEntityName2 = 'DomainEntityName2';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain(subdomainName, domainName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem('NotDuplicate')
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName2)
      .withDomainEntityDomainItem(domainEntityName2)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain entity', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have multiple validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('SubdomainMustNotDuplicateDomainItems');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('SubdomainMustNotDuplicateDomainItems');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});
