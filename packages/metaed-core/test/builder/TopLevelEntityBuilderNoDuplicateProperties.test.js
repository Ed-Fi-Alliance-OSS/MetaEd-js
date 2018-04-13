// @flow
import { DomainEntityBuilder } from '../../src/builder/DomainEntityBuilder';
import { NamespaceInfoBuilder } from '../../src/builder/NamespaceInfoBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';

import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building domain entity with duplicate decimal properties in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withDecimalProperty(
        entityName,
        documentation,
        true,
        false,
        totalDigits,
        decimalPlaces,
        minValue,
        maxValue,
        null,
        metaEdId,
      )
      .withDecimalProperty(
        entityName,
        documentation,
        true,
        false,
        totalDigits,
        decimalPlaces,
        minValue,
        maxValue,
        null,
        metaEdId,
      )
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one decimal', () => {
    expect(metaEd.propertyIndex.decimal.length).toBe(1);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building domain entity with duplicate integer properties in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withIntegerProperty(entityName, documentation, true, false, maxValue, minValue, null, metaEdId)
      .withIntegerProperty(entityName, documentation, true, false, maxValue, minValue, null, metaEdId)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one integer', () => {
    expect(metaEd.propertyIndex.integer.length).toBe(1);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building domain entity with duplicate string properties in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withStringProperty(entityName, documentation, true, false, maxLength, minLength, null, metaEdId)
      .withStringProperty(entityName, documentation, true, false, maxLength, minLength, null, metaEdId)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one string', () => {
    expect(metaEd.propertyIndex.string.length).toBe(1);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with duplicate boolean properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withBooleanProperty(propertyName, documentation, true, false)
      .withBooleanProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one boolean', () => {
    expect(metaEd.propertyIndex.boolean.length).toBe(1);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with duplicate currency properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCurrencyProperty(propertyName, documentation, true, false)
      .withCurrencyProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one currency', () => {
    expect(metaEd.propertyIndex.currency.length).toBe(1);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with duplicate date properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withDateProperty(propertyName, documentation, true, false)
      .withDateProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one date', () => {
    expect(metaEd.propertyIndex.date.length).toBe(1);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with duplicate duration properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withDurationProperty(propertyName, documentation, true, false)
      .withDurationProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one duration', () => {
    expect(metaEd.propertyIndex.duration.length).toBe(1);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with duplicate enumeration properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withEnumerationProperty(propertyName, documentation, true, false)
      .withEnumerationProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one enumeration', () => {
    expect(metaEd.propertyIndex.enumeration.length).toBe(1);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with duplicate common properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withCommonProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common', () => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with an association property that duplicates name of another property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withAssociationProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero associations', () => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.association.length).toBe(0);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with a short property that duplicates name of another property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withShortProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero shorts', () => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.short.length).toBe(0);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with an shared decimal property that duplicates name of another property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withSharedDecimalProperty(propertyName, '', documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero shared decimals', () => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.sharedDecimal.length).toBe(0);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with a time property that duplicates name of another property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withTimeProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it("should build one common, zero Time's", () => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.time.length).toBe(0);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with a year property that duplicates name of another property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withYearProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero years', () => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.year.length).toBe(0);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with two association properties duplicate property name but different contexts', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context1')
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', () => {
    expect(metaEd.propertyIndex.association.length).toBe(2);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });
});
describe('when building entities with two association properties with duplicate property name and duplicate contexts', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context1')
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context1')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one association', () => {
    expect(metaEd.propertyIndex.association.length).toBe(1);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building entities with two association properties with duplicate property name and duplicate contexts, different shorten to', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .withContext('context1', 'Short1')
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .withContext('context1', 'Short2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', () => {
    expect(metaEd.propertyIndex.association.length).toBe(1);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with two association properties with duplicate property name and duplicate contexts, duplicate shorten to', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .withContext('context1', 'ShortOne')
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .withContext('context1', 'ShortOne')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', () => {
    expect(metaEd.propertyIndex.association.length).toBe(1);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
