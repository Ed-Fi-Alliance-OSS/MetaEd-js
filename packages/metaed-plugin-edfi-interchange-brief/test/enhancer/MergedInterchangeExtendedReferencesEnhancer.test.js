// @flow
import { newInlineCommon, newDomainEntityProperty, newChoiceProperty, newInterchangeItem, newMetaEdEnvironment, newDomainEntity, newDescriptor, newCommonProperty, newInlineCommonProperty, newCommon,
  newEnumeration, newSchoolYearEnumerationProperty, newEnumerationProperty, newBooleanProperty, newCurrencyProperty, newDateProperty, newDecimalProperty, newDurationProperty,
  newIntegerProperty, newPercentProperty, newSharedDecimalProperty, newSharedStringProperty, newSharedIntegerProperty, newSharedShortProperty, newShortProperty, newStringProperty, newTimeProperty } from 'metaed-core';
import type { Common } from 'metaed-core';
import { newMergedInterchange } from '../../src/model/MergedInterchange';
import { enhance as mergedInterchangeExtendedReferencesEnhancer } from '../../src/enhancer/MergedInterchangeExtendedReferencesEnhancer';

function byReferenceName(a, b): number {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

let metaEd;
const interchangeName = 'InterchangeName';
const interchangeLevelDomainEntityName = 'EntityName';
const interchangeLevelDomainEntityDocumentation = 'Entity1Documentation';

const referencedDomainEntity1Name = 'ReferencedEntity1Name';
const referencedDomainEntity2Name = 'ReferencedEntity2Name';
const referencedDescriptor1Name = 'ReferencedDescriptor1Name';
const referencedDescriptor2Name = 'ReferencedDescriptor2Name';
const referencedInlineCommonTypeName = 'InlineCommonTypeName';
const referencedCommonTypeName = 'CommonTypeName';
const referencedChoiceCommonTypeName = 'ChoiceCommonTypeName';

const referencedDomainEntity1Documentation = 'ReferencedEntity1Documentation';
const referencedDomainEntity2Documentation = 'ReferencedEntity2Documentation';
const referencedDescriptor1Documentation = 'ReferencedDescriptor1Documentation';
const referencedDescriptor2Documentation = 'ReferencedDescriptor2Documentation';
const referencedInlineCommonTypeDocumentation = 'InlineCommonTypeDocumentation';
const referencedCommonTypeDocumentation = 'CommonTypeDocumentation';
const referencedChoiceCommonTypeDocumentation = 'ChoiceCommonTypeDocumentation';

const referencedDomainEntity1PropertyName = 'ReferencedEntity1PropertyName';
const referencedDomainEntity2PropertyName = 'ReferencedEntity2PropertyName';
const referencedInlineCommonTypePropertyName = 'InlineCommonTypePropertyName';
const referencedCommonTypePropertyName = 'CommonTypePropertyName';
const referencedChoiceCommonTypePropertyName = 'ChoiceCommonTypePropertyName';

const referencedDomainEntity1PropertyDocumentation = 'ReferencedEntity1Documentation';
const referencedDomainEntity2PropertyDocumentation = 'ReferencedEntity2Documentation';
const referencedInlineCommonTypePropertyDocumentation = 'InlineCommonTypeDocumentation';
const referencedCommonTypePropertyDocumentation = 'CommonTypeDocumentation';
const referencedChoiceCommonTypePropertyDocumentation = 'ChoiceCommonTypeDocumentation';

let mergedInterchange;
let interchangeLevelDomainEntity;

let referencedDomainEntity1;
let referencedDomainEntity2;
let referencedDescriptor1;
let referencedDescriptor2;
let referencedInlineCommonType;
let referencedCommonType;
let referencedChoiceCommonType;

let referencedDomainEntity1Property;
let referencedDomainEntity2Property;
let referencedInlineCommonProperty;
let referencedCommonProperty;
let referencedChoiceProperty;

let domainEntityInterchangeItem;

function setupRepository() {
  metaEd = Object.assign(newMetaEdEnvironment(), {
    plugin: new Map().set('edfi-Xsd', { entity: { mergedInterchange: [] } }),
  });
  mergedInterchange = Object.assign(newMergedInterchange(), {
    metaEdName: interchangeName,
  });
  interchangeLevelDomainEntity = Object.assign(newDomainEntity(), {
    metaEdName: interchangeLevelDomainEntityName,
    documentation: interchangeLevelDomainEntityDocumentation,
  });
  referencedDomainEntity1 = Object.assign(newDomainEntity(), {
    metaEdName: referencedDomainEntity1Name,
    documentation: referencedDomainEntity1Documentation,
  });
  referencedDomainEntity2 = Object.assign(newDomainEntity(), {
    metaEdName: referencedDomainEntity2Name,
    documentation: referencedDomainEntity2Documentation,
  });
  referencedDescriptor1 = Object.assign(newDescriptor(), {
    metaEdName: 'UNUSED Referenced Descriptor 1',
    data: { EdfiXsd: { xsd_DescriptorName: referencedDescriptor1Name } },
    documentation: referencedDescriptor1Documentation,
  });
  referencedDescriptor2 = Object.assign(newDescriptor(), {
    metaEdName: 'UNUSED Referenced Descriptor 2',
    data: { EdfiXsd: { xsd_DescriptorName: referencedDescriptor2Name } },
    documentation: referencedDescriptor2Documentation,
  });
  referencedCommonType = Object.assign(newCommon(), {
    metaEdName: referencedCommonTypeName,
    documentation: referencedCommonTypeDocumentation,
  });
  referencedInlineCommonType = Object.assign((newInlineCommon(): any), {
    metaEdName: referencedInlineCommonTypeName,
    documenation: referencedInlineCommonTypeDocumentation,
  });
  referencedChoiceCommonType = Object.assign(((newChoiceProperty(): any): Common), newCommon(), {
    metaEdName: referencedChoiceCommonTypeName,
    documentation: referencedChoiceCommonTypeDocumentation,
  });
  referencedDomainEntity1Property = Object.assign(newDomainEntityProperty(), {
    metaEdName: 'UNUSED Domain Entity 1 Property',
    data: { EdfiXsd: { xsd_Name: referencedDomainEntity1PropertyName } },
    documentation: referencedDomainEntity1PropertyDocumentation,
    referencedEntity: referencedDomainEntity1,
    isOptional: true,
  });
  referencedDomainEntity2Property = Object.assign(newDomainEntityProperty(), {
    metaEdName: 'UNUSED Domain Entity 2 Property',
    data: { EdfiXsd: { xsd_Name: referencedDomainEntity2PropertyName } },
    documentation: referencedDomainEntity2PropertyDocumentation,
    referencedEntity: referencedDomainEntity2,
    isOptional: true,
  });
  referencedInlineCommonProperty = Object.assign(newInlineCommonProperty(), {
    metaEdName: 'UNUSED Common Type Property',
    data: { EdfiXsd: { xsd_Name: referencedInlineCommonTypePropertyName } },
    documentation: referencedInlineCommonTypePropertyDocumentation,
    referencedEntity: referencedInlineCommonType,
    isOptional: true,
  });
  referencedCommonProperty = Object.assign(newCommonProperty(), {
    metaEdName: 'UNUSED Common Type Property',
    data: { EdfiXsd: { xsd_Name: referencedCommonTypePropertyName } },
    documentation: referencedCommonTypePropertyDocumentation,
    referencedEntity: referencedCommonType,
    isOptional: true,
  });
  referencedChoiceProperty = Object.assign(newChoiceProperty(), {
    metaEdName: 'UNUSED Choice Common Type Property',
    data: { EdfiXsd: { xsd_Name: referencedChoiceCommonTypePropertyName } },
    documentation: referencedChoiceCommonTypePropertyDocumentation,
    referencedEntity: referencedChoiceCommonType,
    isOptional: true,
  });
  domainEntityInterchangeItem = Object.assign(newInterchangeItem(), {
    metaEdName: interchangeLevelDomainEntityName,
    referencedEntity: interchangeLevelDomainEntity,
  });
  const xsdRepository = (metaEd.plugin.get('edfi-Xsd'): any).entity;
  xsdRepository.mergedInterchange.push(mergedInterchange);
  metaEd.entity.domainEntity.set(referencedDomainEntity1.metaEdName, referencedDomainEntity1);
  metaEd.entity.descriptor.set(referencedDescriptor1.metaEdName, referencedDescriptor1);
  metaEd.entity.descriptor.set(referencedDescriptor2.metaEdName, referencedDescriptor2);
  metaEd.entity.common.set(referencedInlineCommonType.metaEdName, referencedInlineCommonType);
  metaEd.entity.common.set(referencedCommonType.metaEdName, referencedCommonType);
  metaEd.entity.common.set(referencedChoiceCommonType.metaEdName, referencedChoiceCommonType);
}

describe('when MergedInterchangeExtendedReferencesEnhancer enhances a mergedInterchange with element with bad markdown character', () => {
  const inputDocumentation: string = 'Documentation for logic (X | Y) \r\n Some Windows Documentation \n Some Unix Documentation \r Some Old Mac Documentation';
  const escapedDocumentation: string = 'Documentation for logic (X \\| Y) <br/> Some Windows Documentation <br/> Some Unix Documentation <br/> Some Old Mac Documentation';
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    referencedDomainEntity1Property.documentation = inputDocumentation;
    interchangeLevelDomainEntity.properties.push(referencedDomainEntity1Property);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate exteded references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(1);
    const extendedReference = (mergedInterchange: any).interchangeBriefExtendedReferences[0];
    expect(extendedReference.name).toBe(referencedDomainEntity1PropertyName);
    expect(extendedReference.description).toContain(escapedDocumentation);
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});
describe('when MergedInterchangeExtendedReferencesEnhancer enhances a mergedInterchange with item with nonreferencing properties', () => {
  const schoolYearEnumeration = Object.assign(newEnumeration(), { metaEdName: 'SchoolYearEnumeration' });
  const enumeration = Object.assign(newEnumeration(), { metaEdName: 'Enumeration' });

  const schoolYearEnumerationProperty = Object.assign(newSchoolYearEnumerationProperty(), { metaEdName: 'SchoolYearEnumerationProperty', referencedEntity: schoolYearEnumeration });
  const enumerationProperty = Object.assign(newEnumerationProperty(), { metaEdName: 'EnumerationProperty', referencedEntity: enumeration });
  const booleanProperty = newBooleanProperty();
  const currencyProperty = newCurrencyProperty();
  const dateProperty = newDateProperty();
  const decimalProperty = newDecimalProperty();
  const durationProperty = newDurationProperty();
  const integerProperty = newIntegerProperty();
  const percentProperty = newPercentProperty();
  const sharedDecimalProperty = newSharedDecimalProperty();
  const sharedIntegerProperty = newSharedIntegerProperty();
  const sharedShortProperty = newSharedShortProperty();
  const sharedStringProperty = newSharedStringProperty();
  const shortProperty = newShortProperty();
  const stringProperty = newStringProperty();
  const timeProperty = newTimeProperty();
  const yearProperty = newTimeProperty();
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    mergedInterchange.identityTemplates.push(domainEntityInterchangeItem);
    interchangeLevelDomainEntity.properties.push(schoolYearEnumerationProperty, enumerationProperty, booleanProperty, currencyProperty, dateProperty, decimalProperty, durationProperty, integerProperty,
    percentProperty, sharedDecimalProperty, sharedIntegerProperty, sharedShortProperty, sharedStringProperty, shortProperty, stringProperty, timeProperty, yearProperty);
  });
  it('should generate exteded references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(0);
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange with optional collection element', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    referencedDomainEntity1Property.isOptional = false;
    referencedDomainEntity1Property.isOptionalCollection = true;
    referencedDomainEntity1Property.isRequired = false;
    referencedDomainEntity1Property.isRequiredCollection = false;
    interchangeLevelDomainEntity.properties.push(referencedDomainEntity1Property);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(1);
    const extendedReference = (mergedInterchange: any).interchangeBriefExtendedReferences[0];
    expect(extendedReference.name).toBe(referencedDomainEntity1PropertyName);
    expect(extendedReference.description).toContain(referencedDomainEntity1Documentation);
    expect(extendedReference.description).toContain('Optional');
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange with required collection element', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    referencedDomainEntity1Property.isOptional = false;
    referencedDomainEntity1Property.isOptionalCollection = false;
    referencedDomainEntity1Property.isRequired = false;
    referencedDomainEntity1Property.isRequiredCollection = true;
    interchangeLevelDomainEntity.properties.push(referencedDomainEntity1Property);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(1);
    const extendedReference = (mergedInterchange: any).interchangeBriefExtendedReferences[0];
    expect(extendedReference.name).toBe(referencedDomainEntity1PropertyName);
    expect(extendedReference.description).toContain(referencedDomainEntity1Documentation);
    expect(extendedReference.description).toContain('Required');
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange with element referencing domain entity', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    interchangeLevelDomainEntity.properties.push(referencedDomainEntity1Property);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(1);
    const extendedReference = (mergedInterchange: any).interchangeBriefExtendedReferences[0];
    expect(extendedReference.name).toBe(referencedDomainEntity1PropertyName);
    expect(extendedReference.description).toContain(referencedDomainEntity1Documentation);
    expect(extendedReference.description).toContain('Optional');
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange with identity template referencing domain entity', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    interchangeLevelDomainEntity.identityProperties.push(referencedDomainEntity1Property);
    interchangeLevelDomainEntity.properties.push(referencedDomainEntity1Property);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(1);
    const extendedReference = (mergedInterchange: any).interchangeBriefExtendedReferences[0];
    expect(extendedReference.name).toBe(referencedDomainEntity1PropertyName);
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange with identity template referencing non-identity domain entity', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.identityTemplates.push(domainEntityInterchangeItem);
    interchangeLevelDomainEntity.identityProperties.push(referencedDomainEntity1Property);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should not generate required extended references or descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(0);
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange referencing inline common type with no references', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    interchangeLevelDomainEntity.properties.push(referencedInlineCommonProperty);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should not generate required extended references or descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(0);
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange referencing inline common type with single reference', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    referencedInlineCommonType.properties.push(referencedDomainEntity1Property);
    interchangeLevelDomainEntity.properties.push(referencedInlineCommonProperty);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(1);
    const extendedReference = (mergedInterchange: any).interchangeBriefExtendedReferences[0];
    const extendedReferenceName: string = extendedReference.name;
    expect(extendedReferenceName).toBe(referencedDomainEntity1PropertyName);
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange referencing inline common type with multiple references', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);

    referencedInlineCommonType.properties.push(referencedDomainEntity1Property);
    referencedInlineCommonType.properties.push(referencedDomainEntity2Property);

    interchangeLevelDomainEntity.properties.push(referencedInlineCommonProperty);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(2);
    const extendedReference = (mergedInterchange: any).interchangeBriefExtendedReferences[0];
    const extendedReferenceName: string = extendedReference.name;
    expect(extendedReferenceName).toBe(referencedDomainEntity1PropertyName);
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange referencing common type with no references', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    interchangeLevelDomainEntity.properties.push(referencedCommonProperty);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should not generate required extended references or descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(0);
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange referencing common type with single reference', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    referencedCommonType.properties.push(referencedDomainEntity1Property);
    interchangeLevelDomainEntity.properties.push(referencedCommonProperty);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(1);
    const extendedReference = (mergedInterchange: any).interchangeBriefExtendedReferences[0];
    const extendedReferenceName: string = extendedReference.name;
    expect(extendedReferenceName).toBe(referencedDomainEntity1PropertyName);
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange referencing common type with multiple references', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);

    referencedCommonType.properties.push(referencedDomainEntity1Property);
    referencedCommonType.properties.push(referencedDomainEntity2Property);

    interchangeLevelDomainEntity.properties.push(referencedCommonProperty);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(2);
    (mergedInterchange: any).interchangeBriefExtendedReferences.sort(byReferenceName);
    const extendedReferences = (mergedInterchange: any).interchangeBriefExtendedReferences;
    expect(extendedReferences[0].name).toBe(referencedDomainEntity1PropertyName);
    expect(extendedReferences[1].name).toBe(referencedDomainEntity2PropertyName);
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange referencing choice common type with no references', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    interchangeLevelDomainEntity.properties.push(referencedChoiceProperty);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should not generate extended references or descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(0);
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});
describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange referencing choice common type with single reference', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);
    referencedChoiceCommonType.properties.push(referencedDomainEntity1Property);
    interchangeLevelDomainEntity.properties.push(referencedChoiceProperty);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(1);
    const extendedReference = (mergedInterchange: any).interchangeBriefExtendedReferences[0];
    const extendedReferenceName: string = extendedReference.name;
    expect(extendedReferenceName).toBe(referencedDomainEntity1PropertyName);
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});

describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange referencing choice common type with multiple references', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);

    referencedChoiceCommonType.properties.push(referencedDomainEntity1Property);
    referencedChoiceCommonType.properties.push(referencedDomainEntity2Property);

    interchangeLevelDomainEntity.properties.push(referencedChoiceProperty);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(2);
    (mergedInterchange: any).interchangeBriefExtendedReferences.sort(byReferenceName);
    const extendedReferences = (mergedInterchange: any).interchangeBriefExtendedReferences;
    expect(extendedReferences[0].name).toBe(referencedDomainEntity1PropertyName);
    expect(extendedReferences[1].name).toBe(referencedDomainEntity2PropertyName);
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});
describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange referencing recursively with all required in path', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);

    referencedInlineCommonProperty.isOptional = false;
    referencedInlineCommonProperty.isOptionalCollection = false;
    referencedInlineCommonProperty.isRequired = true;
    referencedInlineCommonProperty.isRequiredCollection = false;

    interchangeLevelDomainEntity.properties.push(referencedInlineCommonProperty);

    referencedCommonProperty.isOptional = false;
    referencedCommonProperty.isOptionalCollection = false;
    referencedCommonProperty.isRequired = true;
    referencedCommonProperty.isRequiredCollection = false;
    referencedInlineCommonType.properties.push(referencedCommonProperty);

    referencedDomainEntity1Property.isOptional = false;
    referencedDomainEntity1Property.isOptionalCollection = false;
    referencedDomainEntity1Property.isRequired = true;
    referencedDomainEntity1Property.isRequiredCollection = false;
    referencedCommonType.properties.push(referencedDomainEntity1Property);

    referencedCommonType.properties.push(referencedDomainEntity1Property);

    interchangeLevelDomainEntity.properties.push(referencedCommonProperty);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(1);
    (mergedInterchange: any).interchangeBriefExtendedReferences.sort(byReferenceName);
    const extendedReference = (mergedInterchange: any).interchangeBriefExtendedReferences[0];
    expect(extendedReference.name).toBe(referencedDomainEntity1PropertyName);
    expect(extendedReference.description).toContain(referencedDomainEntity1Documentation);
    expect(extendedReference.description).toContain('Required');
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});
describe('when MergedInterchangeExtendedReferencesEnhancer enhances mergedInterchange referencing recursively with optional in path', () => {
  beforeAll(() => {
    setupRepository();
    mergedInterchange.elements.push(domainEntityInterchangeItem);

    referencedInlineCommonProperty.isOptional = false;
    referencedInlineCommonProperty.isOptionalCollection = false;
    referencedInlineCommonProperty.isRequired = true;
    referencedInlineCommonProperty.isRequiredCollection = false;

    interchangeLevelDomainEntity.properties.push(referencedInlineCommonProperty);

    referencedCommonProperty.isOptional = true;
    referencedCommonProperty.isOptionalCollection = false;
    referencedCommonProperty.isRequired = false;
    referencedCommonProperty.isRequiredCollection = false;
    referencedInlineCommonType.properties.push(referencedCommonProperty);

    referencedDomainEntity1Property.isOptional = false;
    referencedDomainEntity1Property.isOptionalCollection = false;
    referencedDomainEntity1Property.isRequired = true;
    referencedDomainEntity1Property.isRequiredCollection = false;
    referencedCommonType.properties.push(referencedDomainEntity1Property);

    referencedCommonType.properties.push(referencedDomainEntity1Property);

    interchangeLevelDomainEntity.properties.push(referencedCommonProperty);
    mergedInterchangeExtendedReferencesEnhancer(metaEd);
  });
  it('should generate required extended references', () => {
    expect((mergedInterchange: any).interchangeBriefExtendedReferences.length).toBe(1);
    (mergedInterchange: any).interchangeBriefExtendedReferences.sort(byReferenceName);
    const extendedReference = (mergedInterchange: any).interchangeBriefExtendedReferences[0];
    expect(extendedReference.name).toBe(referencedDomainEntity1PropertyName);
    expect(extendedReference.description).toContain(referencedDomainEntity1Documentation);
    expect(extendedReference.description).toContain('Optional');
  });
  it('should not generate descriptors', () => {
    expect((mergedInterchange: any).interchangeBriefDescriptorReferences.length).toBe(0);
  });
});
