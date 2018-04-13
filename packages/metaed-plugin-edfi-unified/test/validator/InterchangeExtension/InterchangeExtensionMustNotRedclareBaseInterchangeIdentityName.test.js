// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, InterchangeBuilder, NamespaceInfoBuilder } from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/InterchangeExtension/InterchangeExtensionMustNotRedeclareBaseInterchangeIdentityName';

describe('when validating interchange extension identity template has different names than base interchange', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName: string = 'InterchangeName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(interchangeName)
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName1')
      .withEndInterchange()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName2')
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange extension identity template duplicates names in base interchange', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName: string = 'InterchangeName';
  const domainEntityTemplateName: string = 'DomainEntityIdentityTemplateName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(interchangeName)
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withDomainEntityIdentityTemplate(domainEntityTemplateName)
      .withEndInterchange()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityIdentityTemplate(domainEntityTemplateName)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareBaseInterchangeIdentityName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating interchange extension identity template duplicates names in base interchange should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating interchange extension identity template duplicates names in base interchange should have validation failure -> sourceMap',
    );
  });
});

describe('when interchange extension identity templates duplicates multiple names in base interchange', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName: string = 'InterchangeName';
  const domainEntityTemplateName1: string = 'DomainEntityIdentityTemplateName1';
  const domainEntityTemplateName2: string = 'DomainEntityIdentityTemplateName2';
  const notDuplicateDomainEntityTemplateName: string = 'NotDuplicateDomainEntityTemplateName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(interchangeName)
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withDomainEntityIdentityTemplate(domainEntityTemplateName1)
      .withDomainEntityIdentityTemplate(domainEntityTemplateName2)
      .withEndInterchange()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityIdentityTemplate(domainEntityTemplateName1)
      .withDomainEntityIdentityTemplate(domainEntityTemplateName2)
      .withDomainEntityIdentityTemplate(notDuplicateDomainEntityTemplateName)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('InterchangeExtensionMustNotRedeclareBaseInterchangeIdentityName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).not.toMatch(new RegExp(notDuplicateDomainEntityTemplateName));
    expect(failures[0].message).toMatchSnapshot(
      'when interchange extension identity templates duplicates multiple names in base interchange should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when interchange extension identity templates duplicates multiple names in base interchange should have validation failure -> sourceMap',
    );

    expect(failures[1].validatorName).toBe('InterchangeExtensionMustNotRedeclareBaseInterchangeIdentityName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).not.toMatch(new RegExp(notDuplicateDomainEntityTemplateName));
    expect(failures[1].message).toMatchSnapshot(
      'when interchange extension identity templates duplicates multiple names in base interchange should have validation failure -> message',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when interchange extension identity templates duplicates multiple names in base interchange should have validation failure -> sourceMap',
    );
  });
});
