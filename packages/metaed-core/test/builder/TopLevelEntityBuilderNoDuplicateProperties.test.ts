import { DomainEntityBuilder } from '../../src/builder/DomainEntityBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';

import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building domain entity with duplicate decimal properties in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity('DomainEntity')
      .withDocumentation(documentation)
      .withDecimalProperty(entityName, documentation, true, false, totalDigits, decimalPlaces, minValue, maxValue)
      .withDecimalProperty(entityName, documentation, true, false, totalDigits, decimalPlaces, minValue, maxValue)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one decimal', (): void => {
    expect(metaEd.propertyIndex.decimal.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building domain entity with duplicate integer properties in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity('DomainEntity')
      .withDocumentation(documentation)
      .withIntegerProperty(entityName, documentation, true, false, maxValue, minValue)
      .withIntegerProperty(entityName, documentation, true, false, maxValue, minValue)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one integer', (): void => {
    expect(metaEd.propertyIndex.integer.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building domain entity with duplicate string properties in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity('DomainEntity')
      .withDocumentation(documentation)
      .withStringProperty(entityName, documentation, true, false, maxLength, minLength)
      .withStringProperty(entityName, documentation, true, false, maxLength, minLength)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one string', (): void => {
    expect(metaEd.propertyIndex.string.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with duplicate boolean properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withBooleanProperty(propertyName, documentation, true, false)
      .withBooleanProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one boolean', (): void => {
    expect(metaEd.propertyIndex.boolean.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with duplicate currency properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCurrencyProperty(propertyName, documentation, true, false)
      .withCurrencyProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one currency', (): void => {
    expect(metaEd.propertyIndex.currency.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with duplicate date properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withDateProperty(propertyName, documentation, true, false)
      .withDateProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one date', (): void => {
    expect(metaEd.propertyIndex.date.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with duplicate duration properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withDurationProperty(propertyName, documentation, true, false)
      .withDurationProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one duration', (): void => {
    expect(metaEd.propertyIndex.duration.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with duplicate enumeration properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withEnumerationProperty(propertyName, documentation, true, false)
      .withEnumerationProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one enumeration', (): void => {
    expect(metaEd.propertyIndex.enumeration.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with duplicate common properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withCommonProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with an association property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withAssociationProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero associations', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.association.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with a short property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withShortProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero shorts', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.short.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with an shared decimal property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withSharedDecimalProperty(propertyName, '', documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero shared decimals', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.sharedDecimal.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with a time property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withTimeProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it("should build one common, zero Time's", () => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.time.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with a datetime property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withDatetimeProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero datetimes', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.datetime.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with a year property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withYearProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero years', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.year.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with two association properties duplicate property name but different contexts', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context1')
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});
describe('when building entities with two association properties with duplicate property name and duplicate contexts', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context1')
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context1')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one association', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(1);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with two association properties with duplicate property name and duplicate contexts, different shorten to', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .roleName('context1', 'Short1')
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .roleName('context1', 'Short2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(1);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with two association properties with duplicate property name and duplicate contexts, duplicate shorten to', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .roleName('context1', 'ShortOne')
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .roleName('context1', 'ShortOne')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(1);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
