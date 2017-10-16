// @flow
import {
  AssociationBuilder,
  AssociationExtensionBuilder,
  AssociationSubclassBuilder,
  ChoiceBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
  DescriptorBuilder,
  DomainBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  DomainEntitySubclassBuilder,
  EnumerationBuilder,
  InterchangeBuilder,
  SharedDecimalBuilder,
  SharedIntegerBuilder,
  SharedStringBuilder,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../../metaed-plugin-edfi-unified/src/validator/MetaEdId/MetaEdIdIsRequiredForEntities';

describe('when validating abstract entity is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity('AbstractEntityName')
      .withDocumentation('AbstractEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating abstract entity is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating abstract entity is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating association is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation('AssociationName')
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty('FirstDomainEntityName', 'FirstDomainEntityDocumentation')
      .withAssociationDomainEntityProperty('SecondDomainEntityName', 'SecondDomainEntityDocumentation')
      .withEndAssociation()
      .withEndNamespace()
      .sendToListener(new AssociationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating association is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating association is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating association extension is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociationExtension('AssociationExtensionName')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating association extension is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating association extension is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating association subclass is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociationSubclass('AssociationSubclassName', 'BaseAssociationName')
      .withDocumentation('AssociationSubclassDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association subclass', () => {
    expect(metaEd.entity.associationSubclass.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating association subclass is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating association subclass is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating choice is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartChoice('ChoiceName')
      .withDocumentation('ChoiceDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new ChoiceBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one choice', () => {
    expect(metaEd.entity.choice.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating choice is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating choice is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating common is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon('CommonName')
      .withDocumentation('CommonsDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating common is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating common extension is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonExtension('CommonExtensionName')
      .withDocumentation('CommonsExtensionDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndCommonExtension()
      .withEndNamespace()
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common extension', () => {
    expect(metaEd.entity.commonExtension.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating common extension is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common extension is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating descriptor is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor('DescriptorName')
      .withDocumentation('DescriptorDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new DescriptorBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one descriptor', () => {
    expect(metaEd.entity.descriptor.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating descriptor is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating descriptor is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating domain is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomain('DomainName')
      .withDocumentation('DomainDocumentation')
      .withDomainEntityDomainItem('DomainItemName')
      .withEndDomain()
      .withEndNamespace()
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating domain is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating domain is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating domain entity is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating domain entity is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating domain entity is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating domain entity extension is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntityExtension('DomainEntityExtensionName')
      .withDocumentation('DomainEntityExtensionDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating domain entity extension is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating domain entity extension is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating domain entity subclass is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntitySubclass('DomainEntitySubclassName', 'DomainEntityName')
      .withDocumentation('DomainEntitySubclassDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating domain entity subclass is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating domain entity subclass is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating enumeration is missing metaEdId for entity', () => {
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
      .sendToListener(new EnumerationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating enumeration is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating enumeration is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating inline common is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInlineCommon('InlineCommonName')
      .withDocumentation('InlineCommonDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndInlineCommon()
      .withEndNamespace()
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one inline common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating inline common is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating inline common is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating interchange is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating interchange is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating map type enumeration is missing metaEdId for entity', () => {
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
      .sendToListener(new DescriptorBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one descriptor', () => {
    expect(metaEd.entity.descriptor.size).toBe(1);
  });

  it('should build one map type enumeration', () => {
    expect(metaEd.entity.mapTypeEnumeration.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating map type enumeration is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating map type enumeration is missing metaEdId for entity should have validation failures -> sourceMap');
    expect(failures[1].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot('when validating map type enumeration is missing metaEdId for entity should have validation failures -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when validating map type enumeration is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating interchange extension is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension('InterchangeExtensionName')
      .withDocumentation('InterchangeExtensionDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating interchange extension is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating interchange extension is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});


describe('when validating school year enumeration is missing metaEdId for entity', () => {
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
      .sendToListener(new EnumerationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one school year enumeration', () => {
    expect(metaEd.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating school year enumeration is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating school year enumeration is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating shared decimal is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedDecimal('SharedDecimalName')
      .withDocumentation('SharedDecimalDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared decimal', () => {
    expect(metaEd.entity.sharedDecimal.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating shared decimal is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating shared decimal is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating shared integer is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedInteger('SharedIntegerName')
      .withDocumentation('SharedIntegerDocumentation')
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared integer', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating shared integer is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating shared integer is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating shared short is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort('SharedShortName')
      .withDocumentation('SharedShortDocumentation')
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared short', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating shared short is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating shared short is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});

describe('when validating shared string is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedString('SharedStringName')
      .withDocumentation('SharedStringDocumentation')
      .withMaxLength('100')
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new SharedStringBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared string', () => {
    expect(metaEd.entity.sharedString.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating shared string is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating shared string is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});
describe('when validating subdomain is missing metaEdId for entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('SubdomainDocumentation')
      .withDomainEntityElement('DomainEntityElementName')
      .withEndSubdomain()
      .withEndNamespace()
      .sendToListener(new DomainBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForEntities');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating subdomain is missing metaEdId for entity should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating subdomain is missing metaEdId for entity should have validation failures -> sourceMap');
  });
});
