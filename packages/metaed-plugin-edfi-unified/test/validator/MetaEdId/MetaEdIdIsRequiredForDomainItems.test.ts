import { DomainBuilder, newMetaEdEnvironment, MetaEdTextBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/MetaEdId/MetaEdIdIsRequiredForDomainItems';

describe('when validating domain item is missing metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain('DomainName')
      .withDocumentation('DomainDocumentation')
      .withDomainEntityDomainItem('DomainItemName')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain', (): void => {
    expect(coreNamespace.entity.domain.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForDomainItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when validating subdomain item is missing metaEdId for entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('SubdomainDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForDomainItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
