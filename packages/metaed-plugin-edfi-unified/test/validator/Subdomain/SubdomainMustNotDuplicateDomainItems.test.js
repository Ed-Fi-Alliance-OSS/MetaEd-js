// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/Subdomain/SubdomainMustNotDuplicateDomainItems';

describe('when validating subdomain entity domain item does not duplicate domain items', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName: string = 'DomainName';
  const subdomainName: string = 'SubdomainName';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSubdomain(subdomainName, domainName, '1')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('DomainItem1')
      .withDomainEntityDomainItem('DomainItem2')
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new DomainBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build one subdomain entity', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should build two domain entity domain items', () => {
    const subdomain = metaEd.entity.subdomain.get(subdomainName);
    expect(subdomain).toBeDefined();
    if (subdomain !== undefined) {
      expect(subdomain.domainItems.length).toBe(2);
    }
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating subdomain entity domain item has duplicate domain items', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName: string = 'DomainName';
  const subdomainName: string = 'SubdomainName';
  const domainEntityName: string = 'DomainEntityName';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSubdomain(subdomainName, domainName, '1')
      .withDocumentation('doc')
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new DomainBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build one subdomain entity', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SubdomainMustNotDuplicateDomainItems');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when subdomain entity domain item has duplicate should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when subdomain entity domain item has duplicate should have validation failure -> sourceMap');
  });
});

describe('when validating subdomain entity domain item has multiple duplicate domain items', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName: string = 'DomainName';
  const subdomainName: string = 'SubdomainName';
  const domainEntityName: string = 'DomainEntityName';
  const domainEntityName2: string = 'DomainEntityName2';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSubdomain(subdomainName, domainName, '1')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('NotDuplicate')
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName)
      .withDomainEntityDomainItem(domainEntityName2)
      .withDomainEntityDomainItem(domainEntityName2)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new DomainBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build one subdomain entity', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should have multiple validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('SubdomainMustNotDuplicateDomainItems');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when subdomain entity domain item has duplicate should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when subdomain entity domain item has duplicate should have validation failure -> sourceMap');
    expect(failures[1].validatorName).toBe('SubdomainMustNotDuplicateDomainItems');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot('when subdomain entity domain item has duplicate should have validation failure -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when subdomain entity domain item has duplicate should have validation failure -> sourceMap');
  });
});

