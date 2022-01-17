import { newMetaEdEnvironment, MetaEdTextBuilder, InterchangeBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/InterchangeExtension/InterchangeExtensionIdentifierMustMatchAnInterchange';

describe('when validating interchange extension has valid extendee', (): void => {
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
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName2')
      .withEndInterchange()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartInterchangeExtension(`EdFi.${interchangeName}`)
      .withDomainEntityElement('DomainEntityIdentityTemplateName3')
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

describe('when validating interchange extension has invalid extendee', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('AnEntity')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartInterchangeExtension('EdFi.InterchangeExtensionName')
      .withDomainEntityElement('DomainEntityIdentityTemplateName')
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one interchange extension', (): void => {
    expect(extensionNamespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('InterchangeExtensionIdentifierMustMatchAnInterchange');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
