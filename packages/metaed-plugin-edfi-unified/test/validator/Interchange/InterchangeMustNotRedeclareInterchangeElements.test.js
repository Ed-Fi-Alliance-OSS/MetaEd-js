// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, InterchangeBuilder, NamespaceInfoBuilder } from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/Interchange/InterchangeMustNotRedeclareInterchangeElements';

describe('when validating interchange interchange element has different names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName1')
      .withDomainEntityElement('DomainEntityElementName2')
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange interchange element has duplicate names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityElementName: string = 'DomainEntityElementName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement(domainEntityElementName)
      .withDomainEntityElement(domainEntityElementName)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('InterchangeMustNotRedeclareInterchangeElements');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating interchange interchange element has duplicate names should have no validation failures -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating interchange interchange element has duplicate names should have no validation failures -> sourceMap',
    );
  });
});

describe('when validating interchange interchange element has multiple duplicate names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityElementName1: string = 'DomainEntityElementName1';
  const domainEntityElementName2: string = 'DomainEntityElementName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement(domainEntityElementName1)
      .withDomainEntityElement(domainEntityElementName1)
      .withDomainEntityElement(domainEntityElementName2)
      .withDomainEntityElement(domainEntityElementName2)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('InterchangeMustNotRedeclareInterchangeElements');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating interchange interchange element has multiple duplicate names should have validation failures -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating interchange interchange element has multiple duplicate names should have validation failures -> sourceMap',
    );
    expect(failures[1].validatorName).toBe('InterchangeMustNotRedeclareInterchangeElements');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot(
      'when validating interchange interchange element has multiple duplicate names should have validation failures -> message',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when validating interchange interchange element has multiple duplicate names should have validation failures -> sourceMap',
    );
  });
});
