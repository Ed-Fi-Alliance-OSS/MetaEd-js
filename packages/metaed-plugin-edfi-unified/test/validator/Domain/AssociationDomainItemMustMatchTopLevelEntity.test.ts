import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainBuilder,
  AssociationBuilder,
  AssociationSubclassBuilder,
  NamespaceBuilder,
} from 'metaed-core';
import { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/Domain/AssociationDomainItemMustMatchTopLevelEntity';

describe('when validating association domain item matches top level entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const associationName = 'AssociationName';

  let failures: Array<ValidationFailure>;
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withAssociationDomainItem(associationName)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .withStartAssociation(associationName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain', () => {
    expect(coreNamespace.entity.domain.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association domain item matches top level entity across namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const associationName = 'AssociationName';

  let failures: Array<ValidationFailure>;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(associationName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withAssociationDomainItem(`EdFi.${associationName}`)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies = [coreNamespace];
    failures = validate(metaEd);
  });

  it('should build one domain', () => {
    expect(extensionNamespace.entity.domain.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association domain item matches top level entity subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const associationName = 'AssociationName';
  const associationSubclassName = 'AssociationSubclassName';

  let failures: Array<ValidationFailure>;
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withAssociationDomainItem(associationSubclassName)
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .withStartAssociation(associationName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass(associationSubclassName, associationName)
      .withDocumentation('doc')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain', () => {
    expect(coreNamespace.entity.domain.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association domain item does not match top level entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName = 'DomainName';
  const associationName = 'AssociationName';
  const associationSubclassName = 'AssociationSubclassName';

  let failures: Array<ValidationFailure>;
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain(domainName, '1')
      .withDocumentation('doc')
      .withAssociationDomainItem('AssociationDomainItemName')
      .withFooterDocumentation('FooterDocumentation')
      .withEndDomain()

      .withStartAssociation(associationName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass(associationSubclassName, associationName)
      .withDocumentation('doc')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain', () => {
    expect(coreNamespace.entity.domain.size).toBe(1);
  });

  it('should have one validation failure()', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('AssociationDomainItemMustMatchTopLevelEntity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
