// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DescriptorBuilder, NamespaceInfoBuilder } from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/Descriptor/DescriptorMapTypeItemsMustBeUnique';

describe('when map type enumeration items have different short descriptions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor('EntityName')
      .withDocumentation('EntityDocumentation')
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem('ShortDescription1', 'EnumerationItemDocumentation1')
      .withEnumerationItem('ShortDescription2', 'EnumerationItemDocumentation2')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one descriptor', () => {
    expect(metaEd.entity.descriptor.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when map type enumeration items have duplicate short descriptions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor('EntityName')
      .withDocumentation('EntityDocumentation')
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem('ShortDescription', 'EnumerationItemDocumentation1')
      .withEnumerationItem('ShortDescription', 'EnumerationItemDocumentation2')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one descriptor', () => {
    expect(metaEd.entity.descriptor.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DescriptorMapTypeItemsMustBeUnique');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when map type enumeration items have duplicate short descriptions should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when map type enumeration items have duplicate short descriptions should have validation failure -> sourceMap',
    );
  });
});

describe('when map type enumeration items have multiple duplicate short descriptions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor('EntityName')
      .withDocumentation('EntityDocumentation')
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem('ShortDescription1', 'EnumerationItemDocumentation1')
      .withEnumerationItem('ShortDescription1', 'EnumerationItemDocumentation2')
      .withEnumerationItem('ShortDescription2', 'EnumerationItemDocumentation1')
      .withEnumerationItem('ShortDescription2', 'EnumerationItemDocumentation2')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one descriptor', () => {
    expect(metaEd.entity.descriptor.size).toBe(1);
  });

  it('should have multiple validation failure', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('DescriptorMapTypeItemsMustBeUnique');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when map type enumeration items have multiple duplicate short descriptions should have validation failure-> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when map type enumeration items have multiple duplicate short descriptions should have validation failure-> sourceMap',
    );
    expect(failures[1].validatorName).toBe('DescriptorMapTypeItemsMustBeUnique');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot(
      'when map type enumeration items have multiple duplicate short descriptions should have validation failure-> message',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when map type enumeration items have multiple duplicate short descriptions should have validation failure-> sourceMap',
    );
  });
});
