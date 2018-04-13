// @flow
import { DomainBuilder } from '../../src/builder/DomainBuilder';
import { NamespaceInfoBuilder } from '../../src/builder/NamespaceInfoBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getDomain, getSubdomain } from '../TestHelper';
import type { DomainSourceMap } from '../../src/model/Domain';
import type { SubdomainSourceMap } from '../../src/model/Subdomain';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building domain in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const projectExtension: string = 'ProjectExtension';
  const domainName: string = 'DomainName';
  const domainMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';
  const footerDocumentation: string = 'FooterDocumentation';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomain(metaEd.entity, domainName)).toBeDefined();
    expect(getDomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getDomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getDomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getDomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getDomain(metaEd.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].referencedType).toBe('domainEntity');
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have footer documentation', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, domainName).footerDocumentation).toBe(footerDocumentation);
  });
});

describe('when building domain with association item', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];

  const domainName: string = 'DomainName';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have one domain item', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].referencedType).toBe('association');
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });
});

describe('when building domain with common item', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];

  const domainName: string = 'DomainName';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('EntityDocumentation')
      .withCommonDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have one domain item', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].referencedType).toBe('common');
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });
});

describe('when building domain with inline common item', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];

  const domainName: string = 'DomainName';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('EntityDocumentation')
      .withInlineCommonDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have one domain item', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].referencedType).toBe('inlineCommon');
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });
});

describe('when building domain with descriptor item', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];

  const domainName: string = 'DomainName';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('EntityDocumentation')
      .withDescriptorDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have one domain item', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].referencedType).toBe('descriptor');
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });
});

describe('when building duplicate domains', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const projectExtension: string = 'ProjectExtension';
  const domainName: string = 'DomainName';
  const domainMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';
  const footerDocumentation: string = 'FooterDocumentation';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()

      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomain(metaEd.entity, domainName)).toBeDefined();
    expect(getDomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('DomainBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchSnapshot(
      'when building duplicate domains should have validation failures for each entity -> Domain 1 message',
    );
    expect(validationFailures[0].sourceMap).toMatchSnapshot(
      'when building duplicate domains should have validation failures for each entity -> Domain 1 sourceMap',
    );

    expect(validationFailures[1].validatorName).toBe('DomainBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchSnapshot(
      'when building duplicate domains should have validation failures for each entity -> Domain 2 message',
    );
    expect(validationFailures[1].sourceMap).toMatchSnapshot(
      'when building duplicate domains should have validation failures for each entity -> Domain 2 sourceMap',
    );
  });
});

describe('when building subdomain in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const domainName: string = 'DomainName';
  const parentDomainName: string = 'ParentDomainName';
  const domainMetaEdId: string = '10';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '20';
  const subdomainPosition: number = 1;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getSubdomain(metaEd.entity, domainName)).toBeDefined();
    expect(getSubdomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have namespace', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getSubdomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getSubdomain(metaEd.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', () => {
    expect(getSubdomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have position', () => {
    expect(getSubdomain(metaEd.entity, domainName).position).toBe(subdomainPosition);
  });
});

describe('when building domain with no domain name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';

  const projectExtension: string = 'ProjectExtension';
  const domainName: string = '';
  const domainMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';
  const footerDocumentation: string = 'FooterDocumentation';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should not build choice', () => {
    expect(metaEd.entity.domain.size).toBe(0);
  });

  it('should have missing id error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain with lowercase domain name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';

  const projectExtension: string = 'ProjectExtension';
  const domainName: string = 'domainName';
  const expectedName: string = 'Name';
  const domainMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';
  const footerDocumentation: string = 'FooterDocumentation';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository but with lowercase prefix ignored', () => {
    expect(getDomain(metaEd.entity, expectedName)).toBeDefined();
    expect(getDomain(metaEd.entity, expectedName).metaEdName).toBe(expectedName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getDomain(metaEd.entity, expectedName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getDomain(metaEd.entity, expectedName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getDomain(metaEd.entity, expectedName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getDomain(metaEd.entity, expectedName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', () => {
    expect(getDomain(metaEd.entity, expectedName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, expectedName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(metaEd.entity, expectedName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have footer documentation', () => {
    expect(getDomain(metaEd.entity, expectedName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, expectedName).footerDocumentation).toBe(footerDocumentation);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain with no documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';

  const projectExtension: string = 'ProjectExtension';
  const domainName: string = 'DomainName';
  const domainMetaEdId: string = '1';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';
  const footerDocumentation: string = 'FooterDocumentation';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomain(metaEd.entity, domainName)).toBeDefined();
    expect(getDomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getDomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getDomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getDomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getDomain(metaEd.entity, domainName).documentation).toBe('');
  });

  it('should have one domain item', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have footer documentation', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, domainName).footerDocumentation).toBe(footerDocumentation);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain with no domain item', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';

  const projectExtension: string = 'ProjectExtension';
  const domainName: string = 'DomainName';
  const domainMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const footerDocumentation: string = 'FooterDocumentation';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomain(metaEd.entity, domainName)).toBeDefined();
    expect(getDomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getDomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getDomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getDomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getDomain(metaEd.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have no domain item', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(0);
  });

  it('should not have footer documentation', () => {
    expect(getDomain(metaEd.entity, domainName).footerDocumentation).toBe('');
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain with no text in footer documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';

  const projectExtension: string = 'ProjectExtension';
  const domainName: string = 'DomainName';
  const domainMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';
  const footerDocumentation: string = '\r\nfooter documentation';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withTrailingText(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomain(metaEd.entity, domainName)).toBeDefined();
    expect(getDomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getDomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getDomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getDomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getDomain(metaEd.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should not have footer documentation', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, domainName).footerDocumentation).toBe('');
  });

  it('should have missing text error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain with invalid trailing text', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';

  const projectExtension: string = 'ProjectExtension';
  const domainName: string = 'DomainName';
  const domainMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';
  const trailingText: string = '\r\nTrailingText';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withTrailingText(trailingText)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomain(metaEd.entity, domainName)).toBeDefined();
    expect(getDomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getDomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getDomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getDomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getDomain(metaEd.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', () => {
    expect(getDomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building subdomain with no subdomain name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const domainName: string = '';
  const parentDomainName: string = 'ParentDomainName';
  const domainMetaEdId: string = '10';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '20';
  const subdomainPosition: number = 1;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should not build subdomain', () => {
    expect(metaEd.entity.domain.size).toBe(0);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building subdomain with lowercase subdomain name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const domainName: string = 'domainName';
  const expectedName: string = 'Name';
  const parentDomainName: string = 'ParentDomainName';
  const domainMetaEdId: string = '10';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '20';
  const subdomainPosition: number = 1;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository but with lowercase prefix ignored', () => {
    expect(getSubdomain(metaEd.entity, expectedName)).toBeDefined();
    expect(getSubdomain(metaEd.entity, expectedName).metaEdName).toBe(expectedName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have parent domain', () => {
    expect(getSubdomain(metaEd.entity, expectedName).parentMetaEdName).toBe(parentDomainName);
  });

  it('should have namespace', () => {
    expect(getSubdomain(metaEd.entity, expectedName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getSubdomain(metaEd.entity, expectedName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getSubdomain(metaEd.entity, expectedName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getSubdomain(metaEd.entity, expectedName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', () => {
    expect(getSubdomain(metaEd.entity, expectedName).domainItems).toHaveLength(1);
    expect(getSubdomain(metaEd.entity, expectedName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getSubdomain(metaEd.entity, expectedName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have position', () => {
    expect(getSubdomain(metaEd.entity, expectedName).position).toBe(subdomainPosition);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building subdomain with no parent domain name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const domainName: string = 'DomainName';
  const domainMetaEdId: string = '10';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '20';
  const subdomainPosition: number = 1;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSubdomain(domainName, '', domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getSubdomain(metaEd.entity, domainName)).toBeDefined();
    expect(getSubdomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should not have parent domain', () => {
    expect(getSubdomain(metaEd.entity, domainName).parentMetaEdName).toBe('');
  });

  it('should have namespace', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getSubdomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getSubdomain(metaEd.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', () => {
    expect(getSubdomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have position', () => {
    expect(getSubdomain(metaEd.entity, domainName).position).toBe(subdomainPosition);
  });

  it('should have missing id error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building subdomain with lowercase parent domain name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const domainName: string = 'DomainName';
  const parentDomainName: string = 'parentDomainName';
  const domainMetaEdId: string = '10';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '20';
  const subdomainPosition: number = 1;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getSubdomain(metaEd.entity, domainName)).toBeDefined();
    expect(getSubdomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have parent domain but with lowercase prefix ignored', () => {
    expect(getSubdomain(metaEd.entity, domainName).parentMetaEdName).toBe('DomainName');
  });

  it('should have namespace', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getSubdomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getSubdomain(metaEd.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', () => {
    expect(getSubdomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have position', () => {
    expect(getSubdomain(metaEd.entity, domainName).position).toBe(subdomainPosition);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building subdomain with no documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const domainName: string = 'DomainName';
  const parentDomainName: string = 'ParentDomainName';
  const domainMetaEdId: string = '10';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '20';
  const subdomainPosition: number = 1;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getSubdomain(metaEd.entity, domainName)).toBeDefined();
    expect(getSubdomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have parent domain', () => {
    expect(getSubdomain(metaEd.entity, domainName).parentMetaEdName).toBe(parentDomainName);
  });

  it('should have namespace', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getSubdomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', () => {
    expect(getSubdomain(metaEd.entity, domainName).documentation).toBe('');
  });

  it('should have one domain item', () => {
    expect(getSubdomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have position', () => {
    expect(getSubdomain(metaEd.entity, domainName).position).toBe(subdomainPosition);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building subdomain with no domain item', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const domainName: string = 'DomainName';
  const parentDomainName: string = 'ParentDomainName';
  const domainMetaEdId: string = '10';
  const entityDocumentation: string = 'EntityDocumentation';
  const subdomainPosition: number = 1;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getSubdomain(metaEd.entity, domainName)).toBeDefined();
    expect(getSubdomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have parent domain', () => {
    expect(getSubdomain(metaEd.entity, domainName).parentMetaEdName).toBe(parentDomainName);
  });

  it('should have namespace', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getSubdomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', () => {
    expect(getSubdomain(metaEd.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have no domain item', () => {
    expect(getSubdomain(metaEd.entity, domainName).domainItems).toHaveLength(0);
  });

  it('should have position but with the number ignored', () => {
    expect(getSubdomain(metaEd.entity, domainName).position).toBe(0);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building subdomain with no unsigned int in position', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const domainName: string = 'DomainName';
  const parentDomainName: string = 'ParentDomainName';
  const domainMetaEdId: string = '10';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '20';
  const subdomainPosition: string = '\r\nposition';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withTrailingText(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getSubdomain(metaEd.entity, domainName)).toBeDefined();
    expect(getSubdomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have parent domain', () => {
    expect(getSubdomain(metaEd.entity, domainName).parentMetaEdName).toBe(parentDomainName);
  });

  it('should have namespace', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getSubdomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', () => {
    expect(getSubdomain(metaEd.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', () => {
    expect(getSubdomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have position with default value', () => {
    expect(getSubdomain(metaEd.entity, domainName).position).toBe(0);
  });

  it('should have missing unsigned int error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building subdomain with invalid trailing text', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const domainName: string = 'DomainName';
  const parentDomainName: string = 'ParentDomainName';
  const domainMetaEdId: string = '10';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '20';
  const subdomainPosition: number = 1;
  const trailingText: string = '\r\nTrailingText';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withTrailingText(trailingText)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getSubdomain(metaEd.entity, domainName)).toBeDefined();
    expect(getSubdomain(metaEd.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have parent domain', () => {
    expect(getSubdomain(metaEd.entity, domainName).parentMetaEdName).toBe(parentDomainName);
  });

  it('should have namespace', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getSubdomain(metaEd.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', () => {
    expect(getSubdomain(metaEd.entity, domainName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', () => {
    expect(getSubdomain(metaEd.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', () => {
    expect(getSubdomain(metaEd.entity, domainName).domainItems).toHaveLength(1);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getSubdomain(metaEd.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have position', () => {
    expect(getSubdomain(metaEd.entity, domainName).position).toBe(subdomainPosition);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain source map', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const projectExtension: string = 'ProjectExtension';
  const domainName: string = 'DomainName';
  const domainMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';
  const footerDocumentation: string = 'FooterDocumentation';

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have type', () => {
    expect(getDomain(metaEd.entity, domainName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', () => {
    expect(getDomain(metaEd.entity, domainName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', () => {
    expect(getDomain(metaEd.entity, domainName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have metaEdId', () => {
    expect(getDomain(metaEd.entity, domainName).sourceMap.metaEdId).toBeDefined();
  });

  it('should have namespaceInfo', () => {
    expect(getDomain(metaEd.entity, domainName).sourceMap.namespaceInfo).toBeDefined();
  });

  it('should have domainItems', () => {
    expect(((getDomain(metaEd.entity, domainName).sourceMap: any): DomainSourceMap).domainItems).toHaveLength(1);
  });

  it('should have footerDocumentation', () => {
    expect(((getDomain(metaEd.entity, domainName).sourceMap: any): DomainSourceMap).footerDocumentation).toBeDefined();
  });

  it('should have line, column, text', () => {
    expect(getDomain(metaEd.entity, domainName).sourceMap).toMatchSnapshot();
  });
});

describe('when building subdomain source map', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const domainName: string = 'SubdomainName';
  const parentDomainName: string = 'ParentDomainName';
  const metaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const domainItemName: string = 'DomainItemName';
  const domainItemMetaEdId: string = '2';
  const subdomainPosition: number = 1;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartSubdomain(domainName, parentDomainName, metaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should have type', () => {
    expect(getSubdomain(metaEd.entity, domainName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', () => {
    expect(getSubdomain(metaEd.entity, domainName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', () => {
    expect(getSubdomain(metaEd.entity, domainName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have metaEdId', () => {
    expect(getSubdomain(metaEd.entity, domainName).sourceMap.metaEdId).toBeDefined();
  });

  it('should have namespaceInfo', () => {
    expect(getSubdomain(metaEd.entity, domainName).sourceMap.namespaceInfo).toBeDefined();
  });

  it('should have domainItems', () => {
    expect(((getSubdomain(metaEd.entity, domainName).sourceMap: any): SubdomainSourceMap).domainItems).toHaveLength(1);
  });

  it('should have parent', () => {
    expect(((getSubdomain(metaEd.entity, domainName).sourceMap: any): SubdomainSourceMap).parent).toBeDefined();
  });

  it('should have parentMetaEdName', () => {
    expect(((getSubdomain(metaEd.entity, domainName).sourceMap: any): SubdomainSourceMap).parentMetaEdName).toBeDefined();
  });

  it('should have position', () => {
    expect(((getSubdomain(metaEd.entity, domainName).sourceMap: any): SubdomainSourceMap).position).toBeDefined();
  });

  it('should have line, column, text', () => {
    expect(getSubdomain(metaEd.entity, domainName).sourceMap).toMatchSnapshot();
  });
});
