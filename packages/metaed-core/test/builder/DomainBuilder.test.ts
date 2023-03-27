import { DomainBuilder } from '../../src/builder/DomainBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getDomain, getSubdomain } from '../TestHelper';
import { DomainSourceMap } from '../../src/model/Domain';
import { SubdomainSourceMap } from '../../src/model/Subdomain';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building domain in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const projectExtension = 'ProjectExtension';
  const domainName = 'DomainName';
  const domainMetaEdId = '1';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  const footerDocumentation = 'FooterDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain', (): void => {
    expect(namespace.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomain(namespace.entity, domainName)).toBeDefined();
    expect(getDomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getDomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getDomain(namespace.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getDomain(namespace.entity, domainName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDomain(namespace.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should not be deprecated', (): void => {
    expect(getDomain(namespace.entity, domainName).isDeprecated).toBe(false);
  });

  it('should have one domain item in default namespace', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(namespace.entity, domainName).domainItems[0].referencedType).toBe('domainEntity');
    expect(getDomain(namespace.entity, domainName).domainItems[0].referencedNamespaceName).toBe(namespaceName);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
    expect(getDomain(namespace.entity, domainName).domainItems[0].namespace).toBe(namespace);
  });

  it('should have footer documentation', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(namespace.entity, domainName).footerDocumentation).toBe(footerDocumentation);
  });
});

describe('when building deprecated domain', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const projectExtension = 'ProjectExtension';
  const domainName = 'DomainName';
  const deprecationReason = 'reason';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomain(domainName)
      .withDeprecated(deprecationReason)
      .withDocumentation('doc')
      .withDomainEntityDomainItem('DomainItemName')
      .withFooterDocumentation('doc')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain', (): void => {
    expect(namespace.entity.domain.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getDomain(namespace.entity, domainName).isDeprecated).toBe(true);
    expect(getDomain(namespace.entity, domainName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building domain in extension namespace with item reference to another namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const coreNamespaceName = 'EdFi';

  const projectExtension = 'ProjectExtension';
  const domainName = 'DomainName';
  const domainMetaEdId = '1';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName1 = 'DomainItemName';
  const domainItemName2 = 'DomainItemName';
  const domainItem1MetaEdId = '2';
  const domainItem2MetaEdId = '3';
  const footerDocumentation = 'FooterDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName1, domainItem1MetaEdId)
      .withDomainEntityDomainItem(`${coreNamespaceName}.${domainItemName2}`, domainItem2MetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getDomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have one domain item in default namespace', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(2);
    expect(getDomain(namespace.entity, domainName).domainItems[0].referencedType).toBe('domainEntity');
    expect(getDomain(namespace.entity, domainName).domainItems[0].referencedNamespaceName).toBe(namespaceName);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName1);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItem1MetaEdId);
    expect(getDomain(namespace.entity, domainName).domainItems[0].namespace).toBe(namespace);
  });

  it('should have one domain item in core namespace', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems[1].referencedType).toBe('domainEntity');
    expect(getDomain(namespace.entity, domainName).domainItems[1].referencedNamespaceName).toBe(coreNamespaceName);
    expect(getDomain(namespace.entity, domainName).domainItems[1].metaEdName).toBe(domainItemName2);
    expect(getDomain(namespace.entity, domainName).domainItems[1].metaEdId).toBe(domainItem2MetaEdId);
    expect(getDomain(namespace.entity, domainName).domainItems[1].namespace).toBe(namespace);
  });
});

describe('when building domain with association item', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const domainName = 'DomainName';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have one domain item', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(namespace.entity, domainName).domainItems[0].referencedType).toBe('association');
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });
});

describe('when building domain with common item', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const domainName = 'DomainName';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('EntityDocumentation')
      .withCommonDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have one domain item', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(namespace.entity, domainName).domainItems[0].referencedType).toBe('common');
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });
});

describe('when building domain with inline common item', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const domainName = 'DomainName';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('EntityDocumentation')
      .withInlineCommonDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have one domain item', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(namespace.entity, domainName).domainItems[0].referencedType).toBe('inlineCommon');
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });
});

describe('when building domain with descriptor item', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const domainName = 'DomainName';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, 'ProjectExtension')
      .withStartDomain(domainName, '1')
      .withDocumentation('EntityDocumentation')
      .withDescriptorDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have one domain item', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(namespace.entity, domainName).domainItems[0].referencedType).toBe('descriptor');
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });
});

describe('when building duplicate domains', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const projectExtension = 'ProjectExtension';
  const domainName = 'DomainName';
  const domainMetaEdId = '1';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  const footerDocumentation = 'FooterDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
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
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain', (): void => {
    expect(namespace.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomain(namespace.entity, domainName)).toBeDefined();
    expect(getDomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('DomainBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Domain named DomainName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 9,
        "line": 8,
        "tokenText": "DomainName",
      }
    `);

    expect(validationFailures[1].validatorName).toBe('DomainBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Domain named DomainName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 9,
        "line": 2,
        "tokenText": "DomainName",
      }
    `);
  });
});

describe('when building subdomain in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const domainName = 'DomainName';
  const parentDomainName = 'ParentDomainName';
  const domainMetaEdId = '10';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '20';
  const subdomainPosition = 1;
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one subdomain', (): void => {
    expect(namespace.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSubdomain(namespace.entity, domainName)).toBeDefined();
    expect(getSubdomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have namespace', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getSubdomain(namespace.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSubdomain(namespace.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', (): void => {
    expect(getSubdomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getSubdomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getSubdomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have position', (): void => {
    expect(getSubdomain(namespace.entity, domainName).position).toBe(subdomainPosition);
  });
});

describe('when building domain with no domain name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';

  const projectExtension = 'ProjectExtension';
  const domainName = '';
  const domainMetaEdId = '1';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  const footerDocumentation = 'FooterDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build choice', (): void => {
    expect(namespace.entity.domain.size).toBe(0);
  });

  it('should have missing id error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "missing ID at '[1]', column: 10, line: 2, token: [1]",
              "missing ID at '[1]', column: 10, line: 2, token: [1]",
            ]
        `);
  });
});

describe('when building domain with lowercase domain name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';

  const projectExtension = 'ProjectExtension';
  const domainName = 'domainName';
  const domainMetaEdId = '1';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  const footerDocumentation = 'FooterDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build no domain', (): void => {
    expect(namespace.entity.domain.size).toBe(0);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'd' expecting ID, column: 9, line: 2, token: d",
              "mismatched input 'd' expecting ID, column: 9, line: 2, token: d",
            ]
        `);
  });
});

describe('when building domain with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';

  const projectExtension = 'ProjectExtension';
  const domainName = 'DomainName';
  const domainMetaEdId = '1';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  const footerDocumentation = 'FooterDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain', (): void => {
    expect(namespace.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomain(namespace.entity, domainName)).toBeDefined();
    expect(getDomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getDomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getDomain(namespace.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getDomain(namespace.entity, domainName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDomain(namespace.entity, domainName).documentation).toBe('');
  });

  it('should have no domain item', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(0);
  });

  it('should have no footer documentation', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'domain entity' expecting {'deprecated', 'documentation'}, column: 4, line: 3, token: domain entity",
              "mismatched input 'domain entity' expecting {'deprecated', 'documentation'}, column: 4, line: 3, token: domain entity",
            ]
        `);
  });
});

describe('when building domain with no domain item', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';

  const projectExtension = 'ProjectExtension';
  const domainName = 'DomainName';
  const domainMetaEdId = '1';
  const entityDocumentation = 'EntityDocumentation';
  const footerDocumentation = 'FooterDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain', (): void => {
    expect(namespace.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomain(namespace.entity, domainName)).toBeDefined();
    expect(getDomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getDomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getDomain(namespace.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getDomain(namespace.entity, domainName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDomain(namespace.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have no domain item', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(0);
  });

  it('should not have footer documentation', (): void => {
    expect(getDomain(namespace.entity, domainName).footerDocumentation).toBe('');
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'footer documentation' expecting {'association', 'common', 'descriptor', 'domain entity', 'inline common'}, column: 4, line: 5, token: footer documentation",
              "mismatched input 'footer documentation' expecting {'association', 'common', 'descriptor', 'domain entity', 'inline common'}, column: 4, line: 5, token: footer documentation",
            ]
        `);
  });
});

describe('when building domain with no text in footer documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';

  const projectExtension = 'ProjectExtension';
  const domainName = 'DomainName';
  const domainMetaEdId = '1';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  const footerDocumentation = '\r\nfooter documentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withTrailingText(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain', (): void => {
    expect(namespace.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomain(namespace.entity, domainName)).toBeDefined();
    expect(getDomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getDomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getDomain(namespace.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getDomain(namespace.entity, domainName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDomain(namespace.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should not have footer documentation', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(namespace.entity, domainName).footerDocumentation).toBe('');
  });

  it('should have missing text error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "missing TEXT at 'End Namespace', column: 0, line: 7, token: End Namespace",
              "missing TEXT at 'End Namespace', column: 0, line: 7, token: End Namespace",
            ]
        `);
  });
});

describe('when building domain with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';

  const projectExtension = 'ProjectExtension';
  const domainName = 'DomainName';
  const domainMetaEdId = '1';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withTrailingText(trailingText)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain', (): void => {
    expect(namespace.entity.domain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomain(namespace.entity, domainName)).toBeDefined();
    expect(getDomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getDomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getDomain(namespace.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getDomain(namespace.entity, domainName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDomain(namespace.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', (): void => {
    expect(getDomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getDomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 0, line: 6, token: TrailingText",
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 0, line: 6, token: TrailingText",
      ]
    `);
  });
});

describe('when building subdomain with no subdomain name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const domainName = '';
  const parentDomainName = 'ParentDomainName';
  const domainMetaEdId = '10';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '20';
  const subdomainPosition = 1;
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build subdomain', (): void => {
    expect(namespace.entity.domain.size).toBe(0);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "extraneous input 'of' expecting ID, column: 13, line: 2, token: of",
              "mismatched input '[10]' expecting 'of', column: 33, line: 2, token: [10]",
              "extraneous input 'of' expecting ID, column: 13, line: 2, token: of",
              "mismatched input '[10]' expecting 'of', column: 33, line: 2, token: [10]",
            ]
        `);
  });
});

describe('when building subdomain with lowercase subdomain name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const domainName = 'domainName';
  const parentDomainName = 'ParentDomainName';
  const domainMetaEdId = '10';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '20';
  const subdomainPosition = 1;
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build no subdomain', (): void => {
    expect(namespace.entity.subdomain.size).toBe(0);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'd' expecting ID, column: 12, line: 2, token: d",
              "mismatched input 'd' expecting ID, column: 12, line: 2, token: d",
            ]
        `);
  });
});

describe('when building subdomain with no parent domain name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const domainName = 'DomainName';
  const domainMetaEdId = '10';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '20';
  const subdomainPosition = 1;
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSubdomain(domainName, '', domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one subdomain', (): void => {
    expect(namespace.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSubdomain(namespace.entity, domainName)).toBeDefined();
    expect(getSubdomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should not have parent domain', (): void => {
    expect(getSubdomain(namespace.entity, domainName).parentMetaEdName).toBe('');
  });

  it('should have namespace', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getSubdomain(namespace.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getSubdomain(namespace.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', (): void => {
    expect(getSubdomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getSubdomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getSubdomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have position', (): void => {
    expect(getSubdomain(namespace.entity, domainName).position).toBe(subdomainPosition);
  });

  it('should have missing id error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "missing ID at '[10]', column: 27, line: 2, token: [10]",
              "missing ID at '[10]', column: 27, line: 2, token: [10]",
            ]
        `);
  });
});

describe('when building subdomain with lowercase parent domain name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const domainName = 'DomainName';
  const parentDomainName = 'parentDomainName';
  const domainMetaEdId = '10';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '20';
  const subdomainPosition = 1;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'p' expecting ID, column: 26, line: 2, token: p",
              "mismatched input 'p' expecting ID, column: 26, line: 2, token: p",
            ]
        `);
  });
});

describe('when building subdomain with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const domainName = 'DomainName';
  const parentDomainName = 'ParentDomainName';
  const domainMetaEdId = '10';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '20';
  const subdomainPosition = 1;
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one subdomain', (): void => {
    expect(namespace.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSubdomain(namespace.entity, domainName)).toBeDefined();
    expect(getSubdomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have parent domain', (): void => {
    expect(getSubdomain(namespace.entity, domainName).parentMetaEdName).toBe(parentDomainName);
  });

  it('should have namespace', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getSubdomain(namespace.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', (): void => {
    expect(getSubdomain(namespace.entity, domainName).documentation).toBe('');
  });

  it('should have no domain item', (): void => {
    expect(getSubdomain(namespace.entity, domainName).domainItems).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'domain entity' expecting {'deprecated', 'documentation'}, column: 4, line: 3, token: domain entity",
              "mismatched input 'domain entity' expecting {'deprecated', 'documentation'}, column: 4, line: 3, token: domain entity",
            ]
        `);
  });
});

describe('when building subdomain with no domain item', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const domainName = 'DomainName';
  const parentDomainName = 'ParentDomainName';
  const domainMetaEdId = '10';
  const entityDocumentation = 'EntityDocumentation';
  const subdomainPosition = 1;
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one subdomain', (): void => {
    expect(namespace.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSubdomain(namespace.entity, domainName)).toBeDefined();
    expect(getSubdomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have parent domain', (): void => {
    expect(getSubdomain(namespace.entity, domainName).parentMetaEdName).toBe(parentDomainName);
  });

  it('should have namespace', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getSubdomain(namespace.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', (): void => {
    expect(getSubdomain(namespace.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have no domain item', (): void => {
    expect(getSubdomain(namespace.entity, domainName).domainItems).toHaveLength(0);
  });

  it('should have position but with the number ignored', (): void => {
    expect(getSubdomain(namespace.entity, domainName).position).toBe(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'position' expecting {'association', 'common', 'descriptor', 'domain entity', 'inline common'}, column: 4, line: 5, token: position",
        "mismatched input 'position' expecting {'association', 'common', 'descriptor', 'domain entity', 'inline common'}, column: 4, line: 5, token: position",
      ]
    `);
  });
});

describe('when building subdomain with no unsigned int in position', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const domainName = 'DomainName';
  const parentDomainName = 'ParentDomainName';
  const domainMetaEdId = '10';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '20';
  const subdomainPosition = '\r\nposition';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withTrailingText(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one subdomain', (): void => {
    expect(namespace.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSubdomain(namespace.entity, domainName)).toBeDefined();
    expect(getSubdomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have parent domain', (): void => {
    expect(getSubdomain(namespace.entity, domainName).parentMetaEdName).toBe(parentDomainName);
  });

  it('should have namespace', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getSubdomain(namespace.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', (): void => {
    expect(getSubdomain(namespace.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', (): void => {
    expect(getSubdomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getSubdomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getSubdomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have position with default value', (): void => {
    expect(getSubdomain(namespace.entity, domainName).position).toBe(0);
  });

  it('should have missing unsigned int error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "missing UNSIGNED_INT at 'End Namespace', column: 0, line: 7, token: End Namespace",
        "missing UNSIGNED_INT at 'End Namespace', column: 0, line: 7, token: End Namespace",
      ]
    `);
  });
});

describe('when building subdomain with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const domainName = 'DomainName';
  const parentDomainName = 'ParentDomainName';
  const domainMetaEdId = '10';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '20';
  const subdomainPosition = 1;
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSubdomain(domainName, parentDomainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withTrailingText(trailingText)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one subdomain', (): void => {
    expect(namespace.entity.subdomain.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSubdomain(namespace.entity, domainName)).toBeDefined();
    expect(getSubdomain(namespace.entity, domainName).metaEdName).toBe(domainName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have parent domain', (): void => {
    expect(getSubdomain(namespace.entity, domainName).parentMetaEdName).toBe(parentDomainName);
  });

  it('should have namespace', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getSubdomain(namespace.entity, domainName).metaEdId).toBe(domainMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getSubdomain(namespace.entity, domainName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', (): void => {
    expect(getSubdomain(namespace.entity, domainName).documentation).toBe(entityDocumentation);
  });

  it('should have one domain item', (): void => {
    expect(getSubdomain(namespace.entity, domainName).domainItems).toHaveLength(1);
    expect(getSubdomain(namespace.entity, domainName).domainItems[0].metaEdName).toBe(domainItemName);
    expect(getSubdomain(namespace.entity, domainName).domainItems[0].metaEdId).toBe(domainItemMetaEdId);
  });

  it('should have position', (): void => {
    expect(getSubdomain(namespace.entity, domainName).position).toBe(subdomainPosition);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 0, line: 7, token: TrailingText",
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 0, line: 7, token: TrailingText",
      ]
    `);
  });
});

describe('when building domain source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const projectExtension = 'ProjectExtension';
  const domainName = 'DomainName';
  const domainMetaEdId = '1';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  const footerDocumentation = 'FooterDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomain(domainName, domainMetaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withFooterDocumentation(footerDocumentation)
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have type', (): void => {
    expect(getDomain(namespace.entity, domainName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', (): void => {
    expect(getDomain(namespace.entity, domainName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getDomain(namespace.entity, domainName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have metaEdId', (): void => {
    expect(getDomain(namespace.entity, domainName).sourceMap.metaEdId).toBeDefined();
  });

  it('should have domainItems', (): void => {
    expect((getDomain(namespace.entity, domainName).sourceMap as DomainSourceMap).domainItems).toHaveLength(1);
  });

  it('should have footerDocumentation', (): void => {
    expect((getDomain(namespace.entity, domainName).sourceMap as DomainSourceMap).footerDocumentation).toBeDefined();
  });

  it('should have line, column, text', (): void => {
    expect(getDomain(namespace.entity, domainName).sourceMap).toMatchInlineSnapshot(`
      Object {
        "allowPrimaryKeyUpdates": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityNamespaceName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 4,
          "line": 3,
          "tokenText": "documentation",
        },
        "domainItems": Array [
          Object {
            "column": 4,
            "line": 5,
            "tokenText": "domain entity",
          },
        ],
        "entities": Array [],
        "footerDocumentation": Object {
          "column": 4,
          "line": 6,
          "tokenText": "footer documentation",
        },
        "identityProperties": Array [],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdId": Object {
          "column": 20,
          "line": 2,
          "tokenText": "[1]",
        },
        "metaEdName": Object {
          "column": 9,
          "line": 2,
          "tokenText": "DomainName",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "subdomains": Array [],
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Domain",
        },
      }
    `);
  });
});

describe('when building subdomain source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const domainName = 'SubdomainName';
  const parentDomainName = 'ParentDomainName';
  const metaEdId = '1';
  const entityDocumentation = 'EntityDocumentation';
  const domainItemName = 'DomainItemName';
  const domainItemMetaEdId = '2';
  const subdomainPosition = 1;
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartSubdomain(domainName, parentDomainName, metaEdId)
      .withDocumentation(entityDocumentation)
      .withDomainEntityDomainItem(domainItemName, domainItemMetaEdId)
      .withSubdomainPosition(subdomainPosition)
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one subdomain', (): void => {
    expect(namespace.entity.subdomain.size).toBe(1);
  });

  it('should have type', (): void => {
    expect(getSubdomain(namespace.entity, domainName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', (): void => {
    expect(getSubdomain(namespace.entity, domainName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getSubdomain(namespace.entity, domainName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have metaEdId', (): void => {
    expect(getSubdomain(namespace.entity, domainName).sourceMap.metaEdId).toBeDefined();
  });

  it('should have domain items', (): void => {
    expect((getSubdomain(namespace.entity, domainName).sourceMap as SubdomainSourceMap).domainItems).toHaveLength(1);
  });

  it('should have parent', (): void => {
    expect((getSubdomain(namespace.entity, domainName).sourceMap as SubdomainSourceMap).parent).toBeDefined();
  });

  it('should have parentMetaEdName', (): void => {
    expect((getSubdomain(namespace.entity, domainName).sourceMap as SubdomainSourceMap).parentMetaEdName).toBeDefined();
  });

  it('should have position', (): void => {
    expect((getSubdomain(namespace.entity, domainName).sourceMap as SubdomainSourceMap).position).toBeDefined();
  });

  it('should have line, column, text', (): void => {
    expect(getSubdomain(namespace.entity, domainName).sourceMap).toMatchInlineSnapshot(`
      Object {
        "allowPrimaryKeyUpdates": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityNamespaceName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 4,
          "line": 3,
          "tokenText": "documentation",
        },
        "domainItems": Array [
          Object {
            "column": 4,
            "line": 5,
            "tokenText": "domain entity",
          },
        ],
        "entities": Array [],
        "identityProperties": Array [],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdId": Object {
          "column": 46,
          "line": 2,
          "tokenText": "[1]",
        },
        "metaEdName": Object {
          "column": 12,
          "line": 2,
          "tokenText": "SubdomainName",
        },
        "parent": Object {
          "column": 29,
          "line": 2,
          "tokenText": "ParentDomainName",
        },
        "parentMetaEdName": Object {
          "column": 29,
          "line": 2,
          "tokenText": "ParentDomainName",
        },
        "position": Object {
          "column": 13,
          "line": 6,
          "tokenText": "1",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Subdomain",
        },
      }
    `);
  });
});
