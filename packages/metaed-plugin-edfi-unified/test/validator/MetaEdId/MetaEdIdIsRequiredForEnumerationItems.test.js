// @flow
import {
  DescriptorBuilder,
  EnumerationBuilder,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceInfoBuilder,
} from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../../metaed-plugin-edfi-unified/src/validator/MetaEdId/MetaEdIdIsRequiredForEnumerationItems';

describe('when validating enumeration item is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration('EnumerationName')
      .withDocumentation('EnumerationDocumentation')
      .withEnumerationItem('EnumerationItemName', 'EnumerationItemDocumentation')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEnumerationItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when validating enumeration item is missing metaEdId should have validation failures -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating enumeration item is missing metaEdId should have validation failures -> sourceMap',
    );
  });
});

describe('when validating map type enumeration item is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor('DescriptorName')
      .withDocumentation('DescriptorDocumentation')
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem('EnumerationItemShortDescription1', 'EnumerationItemDocumentation')
      .withEnumerationItem('EnumerationItemShortDescription2', 'EnumerationItemDocumentation')
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

  it('should build one map type enumeration', () => {
    expect(metaEd.entity.mapTypeEnumeration.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating school year enumeration item is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration('SchoolYear')
      .withDocumentation('SchoolYearEnumerationDocumentation')
      .withEnumerationItem('EnumerationItemName', 'EnumerationItemDocumentation')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one school year enumeration', () => {
    expect(metaEd.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEnumerationItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when validating school year enumeration item is missing metaEdId should have validation failures -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating school year enumeration item is missing metaEdId should have validation failures -> sourceMap',
    );
  });
});
