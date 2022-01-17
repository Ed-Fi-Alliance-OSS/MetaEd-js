import { newMetaEdEnvironment, MetaEdTextBuilder, DomainBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Subdomain/SubdomainNamesMustBeUnique';

describe('when entities in same namespace have different names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain('ValidName1', 'DomainName')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('SubdomainItem1')
      .withEndSubdomain()

      .withStartSubdomain('ValidName2', 'DomainName')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('SubdomainItem1')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two subdomain', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when entities in same namespace have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain('ValidName1', 'DomainName')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('SubdomainItem1')
      .withEndSubdomain()

      .withStartSubdomain('ValidName1', 'DomainName')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('SubdomainItem1')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one subdomain because DomainBuilder will not let it get that far', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have no validation failures because of DomainBuilder', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when subdomains in separate dependency-linked namespaces have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain('ValidName1', 'DomainName')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('SubdomainItem1')
      .withEndSubdomain()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartSubdomain('ValidName1', 'DomainName')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('SubdomainItem1')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one subdomain in core namespace', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should build one subdomain in extension namespace', (): void => {
    expect(extensionNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when subdomains in non-dependency-linked namespaces have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespacea: any = null;
  let extensionNamespaceb: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSubdomain('NotADuplicate', 'DomainName')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('SubdomainItem1')
      .withEndSubdomain()
      .withEndNamespace()

      .withBeginNamespace('Extensiona', 'Extensiona')
      .withStartSubdomain('ValidName1', 'DomainName')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('SubdomainItem1')
      .withEndSubdomain()
      .withEndNamespace()

      .withBeginNamespace('Extensionb', 'Extensionb')
      .withStartSubdomain('ValidName1', 'DomainName')
      .withDocumentation('doc')
      .withDomainEntityDomainItem('SubdomainItem1')
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespacea = metaEd.namespace.get('Extensiona');
    extensionNamespaceb = metaEd.namespace.get('Extensionb');
    extensionNamespacea.dependencies.push(coreNamespace);
    extensionNamespaceb.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one core subdomain', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should build one extension1 subdomain', (): void => {
    expect(extensionNamespacea.entity.subdomain.size).toBe(1);
  });

  it('should build one extension2 subdomain', (): void => {
    expect(extensionNamespaceb.entity.subdomain.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
