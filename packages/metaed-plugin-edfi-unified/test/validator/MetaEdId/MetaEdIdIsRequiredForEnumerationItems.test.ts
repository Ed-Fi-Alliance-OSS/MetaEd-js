import {
  DescriptorBuilder,
  EnumerationBuilder,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/MetaEdId/MetaEdIdIsRequiredForEnumerationItems';

describe('when validating enumeration item is missing metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartEnumeration('EnumerationName')
      .withDocumentation('EnumerationDocumentation')
      .withEnumerationItem('EnumerationItemName', 'EnumerationItemDocumentation')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one enumeration', (): void => {
    expect(coreNamespace.entity.enumeration.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEnumerationItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating enumeration item is missing metaEdId should have validation failures -> sourceMap',
    );
  });
});

describe('when validating map type enumeration item is missing metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor('DescriptorName')
      .withDocumentation('DescriptorDocumentation')
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem('EnumerationItemShortDescription1', 'EnumerationItemDocumentation')
      .withEnumerationItem('EnumerationItemShortDescription2', 'EnumerationItemDocumentation')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one descriptor', (): void => {
    expect(coreNamespace.entity.descriptor.size).toBe(1);
  });

  it('should build one map type enumeration', (): void => {
    expect(coreNamespace.entity.mapTypeEnumeration.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating school year enumeration item is missing metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartEnumeration('SchoolYear')
      .withDocumentation('SchoolYearEnumerationDocumentation')
      .withEnumerationItem('EnumerationItemName', 'EnumerationItemDocumentation')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one school year enumeration', (): void => {
    expect(coreNamespace.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEnumerationItems');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when validating enumeration item is missing metaEdId in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartEnumeration('EnumerationName')
      .withDocumentation('EnumerationDocumentation')
      .withEnumerationItem('EnumerationItemName', 'EnumerationItemDocumentation')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    extensionNamespace = metaEd.namespace.get('Extension');
    failures = validate(metaEd);
  });

  it('should build one enumeration', (): void => {
    expect(extensionNamespace.entity.enumeration.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
