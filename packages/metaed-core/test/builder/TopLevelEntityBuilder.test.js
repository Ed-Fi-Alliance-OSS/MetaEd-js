// @flow
import { DomainEntityBuilder } from '../../src/builder/DomainEntityBuilder';
import { NamespaceInfoBuilder } from '../../src/builder/NamespaceInfoBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { NoSourceMap } from '../../src/model/SourceMap';
import { getDomainEntity } from '../TestHelper';
import { asAssociationProperty } from '../../src/model/property/AssociationProperty';
import { asCommonProperty } from '../../src/model/property/CommonProperty';
import { asDecimalProperty } from '../../src/model/property/DecimalProperty';
import { asDomainEntityProperty } from '../../src/model/property/DomainEntityProperty';
import { asIntegerProperty } from '../../src/model/property/IntegerProperty';
import { asReferentialProperty } from '../../src/model/property/ReferentialProperty';
import { asShortProperty } from '../../src/model/property/ShortProperty';
import { asStringProperty } from '../../src/model/property/StringProperty';
import type { AssociationPropertySourceMap } from '../../src/model/property/AssociationProperty';
import type { CommonPropertySourceMap } from '../../src/model/property/CommonProperty';
import type { DecimalPropertySourceMap } from '../../src/model/property/DecimalProperty';
import type { DomainEntityPropertySourceMap } from '../../src/model/property/DomainEntityProperty';
import type { IntegerPropertySourceMap } from '../../src/model/property/IntegerProperty';
import type { ReferentialPropertySourceMap } from '../../src/model/property/ReferentialProperty';
import type { ShortPropertySourceMap } from '../../src/model/property/ShortProperty';
import type { StringPropertySourceMap } from '../../src/model/property/StringProperty';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';

// AssociationProperty
describe('when building association property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'association';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have association property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

describe('when building association property with weak reference', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'association';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationProperty(propertyName, propertyDocumentation, false, false)
      .withIsWeakReference(true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have association property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });

  it('should have isWeak', () => {
    expect(asAssociationProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).isWeak).toBe(true);
  });

  it('should have source map for isWeak with line, column, text', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): AssociationPropertySourceMap).isWeak,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): AssociationPropertySourceMap).isWeak,
    ).not.toBe(NoSourceMap);
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): AssociationPropertySourceMap).isWeak,
    ).toMatchSnapshot();
  });
});

// BooleanProperty
describe('when building boolean property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'boolean';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withBooleanProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have boolean property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// ChoiceProperty
describe('when building choice property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'choice';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withChoiceProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have choice property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// CommonProperty
describe('when building common property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'common';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withCommonProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have common property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

describe('when building common property with extension override', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'common';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withCommonExtensionOverrideProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have common property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });

  it('should have isExtensionOverride', () => {
    expect(asCommonProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).isExtensionOverride).toBe(true);
  });

  it('should have source map for isExtensionOverride with line, column, text', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): CommonPropertySourceMap)
        .isExtensionOverride,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): CommonPropertySourceMap)
        .isExtensionOverride,
    ).not.toBe(NoSourceMap);
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): CommonPropertySourceMap)
        .isExtensionOverride,
    ).toMatchSnapshot();
  });
});

// CurrencyProperty
describe('when building currency property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'currency';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withCurrencyProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have currency property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// DateProperty
describe('when building date property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'date';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withDateProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have date property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// DecimalProperty
describe('when building decimal property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'decimal';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const totalDigits: string = '6';
  const decimalPlaces: string = '2';
  const minValue: string = '100';
  const maxValue: string = '1000';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withDecimalProperty(propertyName, propertyDocumentation, true, false, totalDigits, decimalPlaces, minValue, maxValue)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(builder);
  });

  it('should have integer property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
  });

  it('should have hasRestriction', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].hasRestriction).toBe(true);
  });

  it('should have source map for hasRestriction', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.hasRestriction).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.hasRestriction).not.toBe(NoSourceMap);
  });

  it('should have totalDigits', () => {
    expect(asDecimalProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).totalDigits).toBe(totalDigits);
  });

  it('should have source map for totalDigits', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): DecimalPropertySourceMap).totalDigits,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): DecimalPropertySourceMap).totalDigits,
    ).not.toBe(NoSourceMap);
  });

  it('should have decimalPlaces', () => {
    expect(asDecimalProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).decimalPlaces).toBe(decimalPlaces);
  });

  it('should have source map for decimalPlaces', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): DecimalPropertySourceMap).decimalPlaces,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): DecimalPropertySourceMap).decimalPlaces,
    ).not.toBe(NoSourceMap);
  });

  it('should have minValue', () => {
    expect(asDecimalProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).minValue).toBe(minValue);
  });

  it('should have source map for minValue', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): DecimalPropertySourceMap).minValue,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): DecimalPropertySourceMap).minValue,
    ).not.toBe(NoSourceMap);
  });

  it('should have maxValue', () => {
    expect(asDecimalProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).maxValue).toBe(maxValue);
  });

  it('should have source map for maxValue', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): DecimalPropertySourceMap).maxValue,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): DecimalPropertySourceMap).maxValue,
    ).not.toBe(NoSourceMap);
  });

  it('should have source map with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap).toMatchSnapshot();
  });
});

// DescriptorProperty
describe('when building descriptor property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'descriptor';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withDescriptorProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have descriptor property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// DomainEntityProperty
describe('when building domain entity property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'domainEntity';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withDomainEntityElement(propertyName)
      .withDocumentation(propertyDocumentation)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have domain entity property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

describe('when building domain entity property with weak reference', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'domainEntity';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withDomainEntityElement(propertyName)
      .withDocumentation(propertyDocumentation)
      .withIsWeakReference(true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have domain entity property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });

  it('should have isWeak', () => {
    expect(asDomainEntityProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).isWeak).toBe(true);
  });

  it('should have source map for isWeak with line, column, text', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): DomainEntityPropertySourceMap).isWeak,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): DomainEntityPropertySourceMap).isWeak,
    ).not.toBe(NoSourceMap);
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): DomainEntityPropertySourceMap).isWeak,
    ).toMatchSnapshot();
  });
});

// DurationProperty
describe('when building duration property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'duration';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withDurationProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have duration property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// EntityProperty
// TODO: add propertyPathName source map
describe('when building required entity properties', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'entityDocumentation';
  const propertyType: string = 'association';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const metaEdId: string = '1';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationProperty(propertyName, propertyDocumentation, true, false, false, null, metaEdId)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have association property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have association property in property index', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0]).toBe(metaEd.propertyIndex.association[0]);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].documentation).toBe(propertyDocumentation);
  });

  it('should have metaEdName', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
  });

  it('should have metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdId).toBe(metaEdId);
  });

  it('should have namespaceInfo', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].namespaceInfo).toBeDefined();
  });

  it('should have parentEntityName', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].parentEntityName).toBe(entityName);
  });

  it('should have parentEntity', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].parentEntity).toBeDefined();
  });

  it('should have isRequired', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].isRequired).toBe(true);
  });

  it('should have source map for type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
  });

  it('should have source map for documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.documentation).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.documentation).not.toBe(NoSourceMap);
  });

  it('should have source map for metaEdName', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.metaEdName).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.metaEdName).not.toBe(NoSourceMap);
  });

  it('should have source map for metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.metaEdId).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.metaEdId).not.toBe(NoSourceMap);
  });

  it('should have source map for parentEntityName', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.parentEntityName).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.parentEntityName).not.toBe(NoSourceMap);
  });

  it('should have source map for parentEntity', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.parentEntity).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.parentEntity).not.toBe(NoSourceMap);
  });

  it('should have source map for isRequired', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.isRequired).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.isRequired).not.toBe(NoSourceMap);
  });

  it('should have source map with line, column, text for each property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap).toMatchSnapshot();
  });
});

describe('when building entity property with inherited documentation', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const inheritedDocumentation: string = 'inherited';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationProperty(propertyName, inheritedDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have documentationInherited', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].documentationInherited).toBe(true);
  });

  it('should not have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].documentation).toBe('');
  });

  it('should have source map for documentationInherited with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.documentationInherited).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.documentationInherited).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.documentationInherited).toMatchSnapshot();
  });
});

describe('when building identity entity property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationElement(propertyName)
      .withDocumentation(propertyDocumentation)
      .withIdentityIndicator()
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have entity identity property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties).toHaveLength(1);
  });

  it('should have entity source map for identity properties with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.identityProperties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.identityProperties).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.identityProperties).toMatchSnapshot();
  });

  it('should have source map for isPartOfIdentity with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties[0].sourceMap.isPartOfIdentity).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties[0].sourceMap.isPartOfIdentity).not.toBe(
      NoSourceMap,
    );
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties[0].sourceMap.isPartOfIdentity).toMatchSnapshot();
  });
});

describe('when building optional entity property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationProperty(propertyName, propertyDocumentation, false, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have isOptional', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].isOptional).toBe(true);
  });

  it('should have source map for isOptional with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.isOptional).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.isOptional).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.isOptional).toMatchSnapshot();
  });
});

describe('when building required collection entity property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationProperty(propertyName, propertyDocumentation, true, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have isRequiredCollection', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].isRequiredCollection).toBe(true);
  });

  it('should have source map for isRequiredCollection with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.isRequiredCollection).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.isRequiredCollection).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.isRequiredCollection).toMatchSnapshot();
  });
});

describe('when building optional collection entity property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationProperty(propertyName, propertyDocumentation, false, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have isOptionalCollection', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].isOptionalCollection).toBe(true);
  });

  it('should have source map for isOptionalCollection with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.isOptionalCollection).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.isOptionalCollection).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.isOptionalCollection).toMatchSnapshot();
  });
});

describe('when building entity property with context', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationProperty(propertyName, propertyDocumentation, false, false, false)
      .withContext(contextName)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have withContext', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].withContext).toBe(contextName);
  });

  it('should have source map for contextName with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.withContext).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.withContext).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.withContext).toMatchSnapshot();
  });
});

describe('when building entity property with shortened context', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  const shortenToName: string = 'ShortenToName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationProperty(propertyName, propertyDocumentation, false, false, false)
      .withContext(contextName, shortenToName)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shortenTo', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].shortenTo).toBe(shortenToName);
  });

  it('should have source map for shortenTo with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.shortenTo).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.shortenTo).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.shortenTo).toMatchSnapshot();
  });
});

describe('when building renamed identity entity property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const baseName: string = 'BaseName';
  const baseDocumentation: string = 'BaseDocumentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationElement(baseName)
      .withDocumentation(baseDocumentation)
      .withAssociationElement(propertyName)
      .withDocumentation(propertyDocumentation)
      .withIdentityRenameIndicator(baseName)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have entity identity property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties).toHaveLength(1);
  });

  it('should have isIdentityRename', () => {
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties[0].isIdentityRename).toBe(true);
  });

  it('should have baseKeyName', () => {
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties[0].baseKeyName).toBe(baseName);
  });

  it('should have source map for isIdentityRename with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties[0].sourceMap.isIdentityRename).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties[0].sourceMap.isIdentityRename).not.toBe(
      NoSourceMap,
    );
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties[0].sourceMap.isIdentityRename).toMatchSnapshot();
  });

  it('should have source map for baseKeyName with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties[0].sourceMap.baseKeyName).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties[0].sourceMap.baseKeyName).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).identityProperties[0].sourceMap.baseKeyName).toMatchSnapshot();
  });
});

describe('when building queryable entity property ', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationElement(propertyName)
      .withDocumentation(propertyDocumentation)
      .withQueryableOnlyPropertyIndicator()
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have entity queryable field', () => {
    expect(getDomainEntity(metaEd.entity, entityName).queryableFields).toHaveLength(1);
  });

  it('should have entity source map for queryable field with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.queryableFields).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.queryableFields).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.queryableFields).toMatchSnapshot();
  });

  it('should have source map for isQueryableOnly with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).queryableFields[0].sourceMap.isQueryableOnly).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).queryableFields[0].sourceMap.isQueryableOnly).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).queryableFields[0].sourceMap.isQueryableOnly).toMatchSnapshot();
  });
});

describe('when building shared entity property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withSharedDecimalProperty(propertyName, '', propertyDocumentation, false, false)
      .withEndDomainEntity()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have entity property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have referencedType', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].referencedType).toBe(propertyName);
  });

  it('should have source map for referencedType with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.referencedType).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.referencedType).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.referencedType).toMatchSnapshot();
  });
});

// EnumerationProperty
describe('when building enumeration property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'enumeration';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withEnumerationProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have enumeration property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// InlineCommonProperty
describe('when building inline common property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'inlineCommon';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withInlineCommonProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have inline common property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// IntegerProperty
describe('when building integer property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'integer';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const minValue: string = '100';
  const maxValue: string = '1000';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false, maxValue, minValue)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(builder);
  });

  it('should have integer property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
  });

  it('should have hasRestriction', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].hasRestriction).toBe(true);
  });

  it('should have source map for hasRestriction', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.hasRestriction).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.hasRestriction).not.toBe(NoSourceMap);
  });

  it('should have minValue', () => {
    expect(asIntegerProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).minValue).toBe(minValue);
  });

  it('should have source map for minValue', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): IntegerPropertySourceMap).minValue,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): IntegerPropertySourceMap).minValue,
    ).not.toBe(NoSourceMap);
  });

  it('should have maxValue', () => {
    expect(asIntegerProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).maxValue).toBe(maxValue);
  });

  it('should have source map for maxValue', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): IntegerPropertySourceMap).maxValue,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): IntegerPropertySourceMap).maxValue,
    ).not.toBe(NoSourceMap);
  });

  it('should have source map with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap).toMatchSnapshot();
  });
});

// MergedProperty
// TODO: add type, mergeProperty, and targetProperty source maps
describe('when building merged property reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const entityDocumentation: string = 'Documentation';
  const mergePropertyPath: string = 'Entity.Property';
  const targetPropertyPath: string = 'TargetEntity.TargetProperty';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(propertyName, entityDocumentation, true, false)
      .withMergePartOfReference(mergePropertyPath, targetPropertyPath)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(builder);
  });

  it('should have property in merge properties', () => {
    expect(asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties).toHaveLength(1);
  });

  it('should have mergedPropertyPath', () => {
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].mergePropertyPath,
    ).toHaveLength(2);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0]
        .mergePropertyPath[0],
    ).toBe(mergePropertyPath.split('.')[0]);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0]
        .mergePropertyPath[1],
    ).toBe(mergePropertyPath.split('.')[1]);
  });

  it('should have source map for mergePropertyPath with line, column, text', () => {
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].sourceMap
        .mergePropertyPath,
    ).toHaveLength(1);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].sourceMap
        .mergePropertyPath,
    ).not.toBe(NoSourceMap);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].sourceMap
        .mergePropertyPath,
    ).toMatchSnapshot();
  });

  it('should have targetPropertyPath', () => {
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].targetPropertyPath,
    ).toHaveLength(2);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0]
        .targetPropertyPath[0],
    ).toBe(targetPropertyPath.split('.')[0]);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0]
        .targetPropertyPath[1],
    ).toBe(targetPropertyPath.split('.')[1]);
  });

  it('should have source map for targetPropertyPath with line, column, text', () => {
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].sourceMap
        .targetPropertyPath,
    ).toHaveLength(1);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].sourceMap
        .targetPropertyPath,
    ).not.toBe(NoSourceMap);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].sourceMap
        .targetPropertyPath,
    ).toMatchSnapshot();
  });
});

describe('when building multiple merge property references', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const entityDocumentation: string = 'Documentation';

  const mergePropertyPath0: string = 'MergePropertyPath0';
  const targetPropertyPath0: string = 'TargetPropertyPath0';
  const mergePropertyPath1: string = 'MergePropertyPath1';
  const targetPropertyPath1: string = 'TargetPropertyPath1';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(propertyName, entityDocumentation, true, false)
      .withMergePartOfReference(mergePropertyPath0, targetPropertyPath0)
      .withMergePartOfReference(mergePropertyPath1, targetPropertyPath1)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(builder);
  });

  it('should have multiple properties in merged properties', () => {
    expect(asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties).toHaveLength(2);
  });

  it('should have mergedPropertyPath and targetPropertyPath for first merged property', () => {
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].mergePropertyPath,
    ).toHaveLength(1);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].targetPropertyPath,
    ).toHaveLength(1);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0]
        .mergePropertyPath[0],
    ).toBe(mergePropertyPath0);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0]
        .targetPropertyPath[0],
    ).toBe(targetPropertyPath0);
  });

  it('should have source map for first merged property', () => {
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].sourceMap
        .mergePropertyPath[0],
    ).toBeDefined();
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].sourceMap
        .mergePropertyPath[0],
    ).not.toBe(NoSourceMap);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].sourceMap
        .targetPropertyPath[0],
    ).toBeDefined();
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].sourceMap
        .targetPropertyPath[0],
    ).not.toBe(NoSourceMap);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[0].sourceMap,
    ).toMatchSnapshot();
  });

  it('should have mergedPropertyPath and targetPropertyPath for second merged property', () => {
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[1].mergePropertyPath,
    ).toHaveLength(1);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[1].targetPropertyPath,
    ).toHaveLength(1);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[1]
        .mergePropertyPath[0],
    ).toBe(mergePropertyPath1);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[1]
        .targetPropertyPath[0],
    ).toBe(targetPropertyPath1);
  });

  it('should have source map for second merged property', () => {
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[1].sourceMap
        .mergePropertyPath[0],
    ).toBeDefined();
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[1].sourceMap
        .mergePropertyPath[0],
    ).not.toBe(NoSourceMap);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[1].sourceMap
        .targetPropertyPath[0],
    ).toBeDefined();
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[1].sourceMap
        .targetPropertyPath[0],
    ).not.toBe(NoSourceMap);
    expect(
      asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties[1].sourceMap,
    ).toMatchSnapshot();
  });
});

// PercentProperty
describe('when building percent property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'percent';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withPercentProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have percent property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// ReferentialProperty
// TODO: add referencedEntity source map
describe('when building referential property with merged properties', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const mergePropertyPath: string = 'MergedProperty';
  const targetPropertyPath: string = 'MergedPropertyTarget';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationElement(propertyName)
      .withDocumentation(propertyDocumentation)
      .withMergePartOfReference(mergePropertyPath, targetPropertyPath)
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have merged property', () => {
    expect(asReferentialProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).mergedProperties).toHaveLength(1);
  });

  it('should have source map for mergedProperties with line, column, text', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): ReferentialPropertySourceMap)
        .mergedProperties,
    ).not.toBe(NoSourceMap);
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): ReferentialPropertySourceMap)
        .mergedProperties,
    ).toMatchSnapshot();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): ReferentialPropertySourceMap)
        .mergedProperties,
    ).toHaveLength(1);
  });
});

// SchoolYearEnumerationProperty
describe('when building school year enumeration property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'schoolYearEnumeration';
  const propertyName: string = 'SchoolYear';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withEnumerationProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have school year enumeration property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// SharedDecimalProperty
describe('when building shared decimal property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'sharedDecimal';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withSharedDecimalProperty(propertyName, null, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared decimal property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// SharedIntegerProperty
describe('when building shared integer property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'sharedInteger';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withSharedIntegerProperty(propertyName, null, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared integer property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// SharedStringProperty
describe('when building shared string property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'sharedString';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withSharedStringProperty(propertyName, null, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared string property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// ShortProperty
describe('when building short property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'short';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const minValue: string = '100';
  const maxValue: string = '1000';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withShortProperty(propertyName, propertyDocumentation, true, false, maxValue, minValue)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(builder);
  });

  it('should have short property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
  });

  it('should have hasRestriction', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].hasRestriction).toBe(true);
  });

  it('should have source map for hasRestriction', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.hasRestriction).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.hasRestriction).not.toBe(NoSourceMap);
  });

  it('should have minValue', () => {
    expect(asShortProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).minValue).toBe(minValue);
  });

  it('should have source map for minValue', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): ShortPropertySourceMap).minValue,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): ShortPropertySourceMap).minValue,
    ).not.toBe(NoSourceMap);
  });

  it('should have maxValue', () => {
    expect(asShortProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).maxValue).toBe(maxValue);
  });

  it('should have source map for maxValue', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): ShortPropertySourceMap).maxValue,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): ShortPropertySourceMap).maxValue,
    ).not.toBe(NoSourceMap);
  });

  it('should have source map with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap).toMatchSnapshot();
  });
});

// StringProperty
describe('when building string property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'string';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const minLength: string = '100';
  const maxLength: string = '1000';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withStringProperty(propertyName, propertyDocumentation, true, false, maxLength, minLength)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(builder);
  });

  it('should have string property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
  });

  it('should have hasRestriction', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].hasRestriction).toBe(true);
  });

  it('should have source map for hasRestriction', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.hasRestriction).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.hasRestriction).not.toBe(NoSourceMap);
  });

  it('should have minLength', () => {
    expect(asStringProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).minLength).toBe(minLength);
  });

  it('should have source map for minLength', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): StringPropertySourceMap).minLength,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): StringPropertySourceMap).minLength,
    ).not.toBe(NoSourceMap);
  });

  it('should have maxLength', () => {
    expect(asStringProperty(getDomainEntity(metaEd.entity, entityName).properties[0]).maxLength).toBe(maxLength);
  });

  it('should have source map for maxLength', () => {
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): StringPropertySourceMap).maxLength,
    ).toBeDefined();
    expect(
      ((getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap: any): StringPropertySourceMap).maxLength,
    ).not.toBe(NoSourceMap);
  });

  it('should have source map with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap).toMatchSnapshot();
  });
});

// TimeProperty
describe('when building time property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'time';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withTimeProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have time property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});

// YearProperty
describe('when building year property', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyType: string = 'year';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withYearProperty(propertyName, propertyDocumentation, false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have year property in entity properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe(propertyType);
  });

  it('should have source map for type with line, column, text', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).not.toBe(NoSourceMap);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap.type).toMatchSnapshot();
  });
});
