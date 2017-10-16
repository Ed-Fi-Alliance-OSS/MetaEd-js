// @flow
import {
  AssociationBuilder,
  DomainEntityBuilder,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../../metaed-plugin-edfi-unified/src/validator/MetaEdId/MetaEdIdIsRequiredForProperties';

describe('when validating association property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withAssociationProperty('AssociationName', 'AssociationDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one association property', () => {
    expect(metaEd.propertyIndex.association).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating association property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating association property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating choice property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withChoiceProperty('ChoiceName', 'ChoiceDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one choice property', () => {
    expect(metaEd.propertyIndex.choice).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating choice property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating choice property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating common property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withCommonProperty('CommonName', 'CommonDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one common property', () => {
    expect(metaEd.propertyIndex.common).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating common property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating currency property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withCurrencyProperty('CurrencyName', 'CurrencyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one currency property', () => {
    expect(metaEd.propertyIndex.currency).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating currency property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating currency property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating date property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withDateProperty('DateName', 'DateDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one date property', () => {
    expect(metaEd.propertyIndex.date).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating date property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating date property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating decimal property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withDecimalProperty('DecimalName', 'DecimalDocumentation', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one decimal property', () => {
    expect(metaEd.propertyIndex.decimal).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating decimal property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating decimal property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating descriptor property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withDescriptorProperty('DescriptorName', 'DescriptorDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one descriptor property', () => {
    expect(metaEd.propertyIndex.descriptor).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating descriptor property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating descriptor property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating domainEntity property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityProperty('DomainEntityName', 'DomainEntityDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domainEntity property', () => {
    expect(metaEd.propertyIndex.domainEntity).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating domainEntity property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating domainEntity property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating duration property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withDurationProperty('DurationName', 'DurationDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one duration property', () => {
    expect(metaEd.propertyIndex.duration).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating duration property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating duration property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating enumeration property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withEnumerationProperty('EnumerationName', 'EnumerationDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one enumeration property', () => {
    expect(metaEd.propertyIndex.enumeration).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating enumeration property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating enumeration property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating first domain entity property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation('AssociationName')
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty('FirstAssociationDomainEntityProperty', 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty('SecondAssociationDomainEntityProperty', 'AssociationDomainEntityPropertyDocumentation', null, '1')
      .withEndAssociation()
      .withEndNamespace()
      .sendToListener(new AssociationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build two domain entity properties', () => {
    expect(metaEd.propertyIndex.domainEntity).toHaveLength(2);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating first domain entity property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating first domain entity property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating inline common property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withInlineCommonProperty('InlineCommonName', 'InlineCommonDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one inline common property', () => {
    expect(metaEd.propertyIndex.inlineCommon).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating inline common property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating inline common property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating integer property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerProperty('IntegerName', 'IntegerDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one integer property', () => {
    expect(metaEd.propertyIndex.integer).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating integer property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating integer property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating percent property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withPercentProperty('PercentName', 'PercentDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one percent property', () => {
    expect(metaEd.propertyIndex.percent).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating percent property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating percent property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating school year enumeration property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withEnumerationProperty('SchoolYear', 'SchoolYearEnumerationDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one school year enumeration property', () => {
    expect(metaEd.propertyIndex.schoolYearEnumeration).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating school year enumeration property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating school year enumeration property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating second domain entity property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation('AssociationName')
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty('FirstAssociationDomainEntityProperty', 'AssociationDomainEntityPropertyDocumentation', null, '1')
      .withAssociationDomainEntityProperty('SecondAssociationDomainEntityProperty', 'AssociationDomainEntityPropertyDocumentation')
      .withEndAssociation()
      .withEndNamespace()
      .sendToListener(new AssociationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build two domain entity properties', () => {
    expect(metaEd.propertyIndex.domainEntity).toHaveLength(2);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating second domain entity property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating second domain entity property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating shared decimal property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withSharedDecimalProperty('SharedDecimalName', null, 'SharedDecimalDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared decimal property', () => {
    expect(metaEd.propertyIndex.sharedDecimal).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating shared decimal property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating shared decimal property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating shared integer property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withSharedIntegerProperty('SharedIntegerName', null, 'SharedIntegerDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared integer property', () => {
    expect(metaEd.propertyIndex.sharedInteger).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating shared integer property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating shared integer property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating shared short property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withSharedShortProperty('SharedShortName', null, 'SharedShortDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared short property', () => {
    expect(metaEd.propertyIndex.sharedShort).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating shared short property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating shared short property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating shared string property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withSharedStringProperty('SharedStringName', null, 'SharedStringDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared string property', () => {
    expect(metaEd.propertyIndex.sharedString).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating shared string property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating shared string property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating short property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withShortProperty('ShortName', 'ShortDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one short property', () => {
    expect(metaEd.propertyIndex.short).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating short property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating short property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating string property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withStringProperty('StringName', 'StringDocumentation', true, false, '100')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one string property', () => {
    expect(metaEd.propertyIndex.string).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating string property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating string property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating time property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withTimeProperty('TimeName', 'TimeDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one time property', () => {
    expect(metaEd.propertyIndex.time).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating time property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating time property is missing metaEdId should have validation failures -> sourceMap');
  });
});

describe('when validating year property is missing metaEdId', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('DomainEntityDocumentation')
      .withYearProperty('YearName', 'YearDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one year property', () => {
    expect(metaEd.propertyIndex.year).toHaveLength(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MetaEdIdIsRequiredForProperties');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when validating year property is missing metaEdId should have validation failures -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating year property is missing metaEdId should have validation failures -> sourceMap');
  });
});
