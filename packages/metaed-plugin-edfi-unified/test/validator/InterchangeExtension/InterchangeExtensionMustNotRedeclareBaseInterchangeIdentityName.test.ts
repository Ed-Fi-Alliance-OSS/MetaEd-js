import { newMetaEdEnvironment, MetaEdTextBuilder, InterchangeBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/InterchangeExtension/InterchangeExtensionMustNotRedeclareBaseInterchangeIdentityName';

describe('when validating interchange extension identity template has different names than base interchange', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName = 'InterchangeName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInterchange(interchangeName)
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName1')
      .withEndInterchange()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartInterchangeExtension(`EdFi.${interchangeName}`)
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName2')
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', (): void => {
    expect(extensionNamespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange extension identity template duplicates names in base interchange', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName = 'InterchangeName';
  const domainEntityTemplateName = 'DomainEntityIdentityTemplateName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInterchange(interchangeName)
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withDomainEntityIdentityTemplate(domainEntityTemplateName)
      .withEndInterchange()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartInterchangeExtension(`EdFi.${interchangeName}`)
      .withDomainEntityIdentityTemplate(domainEntityTemplateName)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', (): void => {
    expect(extensionNamespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareBaseInterchangeIdentityName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when interchange extension identity templates duplicates multiple names in base interchange', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName = 'InterchangeName';
  const domainEntityTemplateName1 = 'DomainEntityIdentityTemplateName1';
  const domainEntityTemplateName2 = 'DomainEntityIdentityTemplateName2';
  const notDuplicateDomainEntityTemplateName = 'NotDuplicateDomainEntityTemplateName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInterchange(interchangeName)
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withDomainEntityIdentityTemplate(domainEntityTemplateName1)
      .withDomainEntityIdentityTemplate(domainEntityTemplateName2)
      .withEndInterchange()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartInterchangeExtension(`EdFi.${interchangeName}`)
      .withDomainEntityIdentityTemplate(domainEntityTemplateName1)
      .withDomainEntityIdentityTemplate(domainEntityTemplateName2)
      .withDomainEntityIdentityTemplate(notDuplicateDomainEntityTemplateName)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', (): void => {
    expect(extensionNamespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareBaseInterchangeIdentityName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).not.toMatch(new RegExp(notDuplicateDomainEntityTemplateName));
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();

    expect(failures[1].validatorName).toBe('InterchangeExtensionMustNotRedeclareBaseInterchangeIdentityName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).not.toMatch(new RegExp(notDuplicateDomainEntityTemplateName));
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});
