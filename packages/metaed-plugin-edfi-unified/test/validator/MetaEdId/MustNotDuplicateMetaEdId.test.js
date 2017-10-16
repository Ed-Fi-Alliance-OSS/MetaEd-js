// @flow
import {
  DescriptorBuilder,
  DomainBuilder,
  DomainEntityBuilder,
  EnumerationBuilder,
  InterchangeBuilder,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../../metaed-plugin-edfi-unified/src/validator/MetaEdId/MustNotDuplicateMetaEdId';

describe('when validating two entities have different metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1', '1')
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2', '2')
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating two entities have duplicate metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const metaEdId: string = '1';
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1', metaEdId)
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2', metaEdId)
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> sourceMap');
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating two domain items have duplicate metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const metaEdId: string = '1';
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomain('DomainName')
      .withDocumentation('DomainDocumentation')
      .withDomainEntityDomainItem('DomainItemName1', metaEdId)
      .withEndDomain()

      .withStartSubdomain('SubdomainName', 'ParentDomainName')
      .withDocumentation('SubdomainDocumentation')
      .withDomainEntityDomainItem('DomainItemName2', metaEdId)

      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating two domain items have duplicate metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating two domain items have duplicate metaEdId should have validation failures -> sourceMap');
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot('when validating two domain items have duplicate metaEdId should have validation failures -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when validating two domain items have duplicate metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating two enumeration items have duplicate metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const metaEdId: string = '1';
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration('EnumerationName')
      .withDocumentation('EnumerationDocumentation')
      .withEnumerationItem('EnumerationItemName', 'EnumerationItemDocumentation', metaEdId)
      .withEndEnumeration()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('SchoolYearEnumerationDocumentation')
      .withEnumerationItem('EnumerationItemName', 'EnumerationItemDocumentation', metaEdId)
      .withEndEnumeration()
      .withEndNamespace()

      .sendToListener(new EnumerationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should build one school year enumeration', () => {
    expect(metaEd.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating two enumeration items have duplicate metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating two enumeration items have duplicate metaEdId should have validation failures -> sourceMap');
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot('when validating two enumeration items have duplicate metaEdId should have validation failures -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when validating two enumeration items have duplicate metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating two map type enumeration items have duplicate metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const metaEdId: string = '1';
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor('DescriptorName1')
      .withDocumentation('DescriptorDocumentation')
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem('EnumerationItemShortDescription', 'EnumerationItemDocumentation', metaEdId)
      .withEndMapType()
      .withEndDescriptor()

      .withStartDescriptor('DescriptorName2')
      .withDocumentation('DescriptorDocumentation')
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem('EnumerationItemShortDescription', 'EnumerationItemDocumentation', metaEdId)
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new DescriptorBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two map type enumerations', () => {
    expect(metaEd.entity.mapTypeEnumeration.size).toBe(2);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating two map type enumeration items have duplicate metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating two map type enumeration items have duplicate metaEdId should have validation failures -> sourceMap');
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot('when validating two map type enumeration items have duplicate metaEdId should have validation failures -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when validating two map type enumeration items have duplicate metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating interchange items have duplicate metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const metaEdId: string = '1';
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName1', metaEdId)
      .withEndInterchange()

      .withStartInterchangeExtension('InterchangeExtensionName')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName2', metaEdId)
      .withEndInterchangeExtension()
      .withEndNamespace()
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
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating interchange elements have duplicate metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange elements have duplicate metaEdId should have validation failures -> sourceMap');
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot('when validating interchange elements have duplicate metaEdId should have validation failures -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when validating interchange elements have duplicate metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating multiple entities, properties, and items have duplicate metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const metaEdId1: string = '1';
    const metaEdId2: string = '2';
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName1', metaEdId1)
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2', metaEdId2)
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDescriptor('DescriptorName')
      .withDocumentation('DescriptorDocumentation')
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem('EnumerationItemShortDescription', 'EnumerationItemDocumentation', metaEdId1)
      .withEndMapType()
      .withEndDescriptor()

      .withStartDomain('DomainName')
      .withDocumentation('DomainDocumentation')
      .withDomainEntityDomainItem('DomainItemName1', metaEdId1)
      .withEndDomain()

      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName1', metaEdId2)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one map type enumeration', () => {
    expect(metaEd.entity.mapTypeEnumeration.size).toBe(1);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should have five validation failures', () => {
    expect(failures).toHaveLength(5);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> sourceMap');
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> sourceMap');
    expect(failures[2].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[2].category).toBe('warning');
    expect(failures[2].message).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> message');
    expect(failures[2].sourceMap).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> sourceMap');
    expect(failures[3].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[3].category).toBe('warning');
    expect(failures[3].message).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> message');
    expect(failures[3].sourceMap).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> sourceMap');
    expect(failures[4].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[4].category).toBe('warning');
    expect(failures[4].message).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> message');
    expect(failures[4].sourceMap).toMatchSnapshot('when validating two domain entities have duplicate metaEdId should have validation failures -> sourceMap');
  });
});
