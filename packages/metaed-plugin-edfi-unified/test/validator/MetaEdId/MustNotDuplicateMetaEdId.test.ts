import {
  DescriptorBuilder,
  DomainBuilder,
  DomainEntityBuilder,
  EnumerationBuilder,
  InterchangeBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/MetaEdId/MustNotDuplicateMetaEdId';

describe('when validating two entities have different metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1', '1')
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2', '2')
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating two entities have duplicate metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const metaEdId = '1';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1', metaEdId)
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2', metaEdId)
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});

describe('when validating two domain items have duplicate metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const metaEdId = '1';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomain('DomainName')
      .withDocumentation('DomainDocumentation')
      .withDomainEntityDomainItem('DomainItemName1', metaEdId)
      .withEndDomain()

      .withStartSubdomain('SubdomainName', 'ParentDomainName')
      .withDocumentation('SubdomainDocumentation')
      .withDomainEntityDomainItem('DomainItemName2', metaEdId)

      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain', (): void => {
    expect(coreNamespace.entity.domain.size).toBe(1);
  });

  it('should build one subdomain', (): void => {
    expect(coreNamespace.entity.subdomain.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});

describe('when validating two enumeration items have duplicate metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const metaEdId = '1';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartEnumeration('EnumerationName')
      .withDocumentation('EnumerationDocumentation')
      .withEnumerationItem('EnumerationItemName', 'EnumerationItemDocumentation', metaEdId)
      .withEndEnumeration()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('SchoolYearEnumerationDocumentation')
      .withEnumerationItem('EnumerationItemName', 'EnumerationItemDocumentation', metaEdId)
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

  it('should build one school year enumeration', (): void => {
    expect(coreNamespace.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});

describe('when validating two map type enumeration items have duplicate metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const metaEdId = '1';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two map type enumerations', (): void => {
    expect(coreNamespace.entity.mapTypeEnumeration.size).toBe(2);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});

describe('when validating interchange items have duplicate metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const metaEdId = '1';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName1', metaEdId)
      .withEndInterchange()

      .withStartInterchangeExtension('InterchangeExtensionName')
      .withDomainEntityIdentityTemplate('DomainEntityIdentityTemplateName2', metaEdId)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', (): void => {
    expect(coreNamespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});

describe('when validating multiple entities, properties, and items have duplicate metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const metaEdId1 = '1';
    const metaEdId2 = '2';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one map type enumeration', (): void => {
    expect(coreNamespace.entity.mapTypeEnumeration.size).toBe(1);
  });

  it('should build one domain', (): void => {
    expect(coreNamespace.entity.domain.size).toBe(1);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should have five validation failures', (): void => {
    expect(failures).toHaveLength(5);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
    expect(failures[2].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[2].category).toBe('warning');
    expect(failures[2].message).toMatchSnapshot();
    expect(failures[2].sourceMap).toMatchSnapshot();
    expect(failures[3].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[3].category).toBe('warning');
    expect(failures[3].message).toMatchSnapshot();
    expect(failures[3].sourceMap).toMatchSnapshot();
    expect(failures[4].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[4].category).toBe('warning');
    expect(failures[4].message).toMatchSnapshot();
    expect(failures[4].sourceMap).toMatchSnapshot();
  });
});

describe('when validating multiple entities, properties, and items across namespaces have duplicate metaEdId', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    const metaEdId1 = '1';
    const metaEdId2 = '2';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1', metaEdId1)
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2', metaEdId2)
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one map type enumeration', (): void => {
    expect(extensionNamespace.entity.mapTypeEnumeration.size).toBe(1);
  });

  it('should build one domain', (): void => {
    expect(extensionNamespace.entity.domain.size).toBe(1);
  });

  it('should build one interchange', (): void => {
    expect(extensionNamespace.entity.interchange.size).toBe(1);
  });

  it('should have five validation failures', (): void => {
    expect(failures).toHaveLength(5);
    expect(failures[0].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
    expect(failures[2].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[2].category).toBe('warning');
    expect(failures[2].message).toMatchSnapshot();
    expect(failures[2].sourceMap).toMatchSnapshot();
    expect(failures[3].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[3].category).toBe('warning');
    expect(failures[3].message).toMatchSnapshot();
    expect(failures[3].sourceMap).toMatchSnapshot();
    expect(failures[4].validatorName).toBe('MustNotDuplicateMetaEdId');
    expect(failures[4].category).toBe('warning');
    expect(failures[4].message).toMatchSnapshot();
    expect(failures[4].sourceMap).toMatchSnapshot();
  });
});
