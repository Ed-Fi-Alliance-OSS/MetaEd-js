import { newMetaEdEnvironment, MetaEdTextBuilder, InterchangeBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Interchange/InterchangeMustNotRedeclareInterchangeElements';

describe('when validating interchange interchange element has different names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName1')
      .withDomainEntityElement('DomainEntityElementName2')
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange interchange element has duplicate names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityElementName = 'DomainEntityElementName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement(domainEntityElementName)
      .withDomainEntityElement(domainEntityElementName)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('InterchangeMustNotRedeclareInterchangeElements');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when validating interchange interchange element has multiple duplicate names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityElementName1 = 'DomainEntityElementName1';
  const domainEntityElementName2 = 'DomainEntityElementName2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement(domainEntityElementName1)
      .withDomainEntityElement(domainEntityElementName1)
      .withDomainEntityElement(domainEntityElementName2)
      .withDomainEntityElement(domainEntityElementName2)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('InterchangeMustNotRedeclareInterchangeElements');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('InterchangeMustNotRedeclareInterchangeElements');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});
