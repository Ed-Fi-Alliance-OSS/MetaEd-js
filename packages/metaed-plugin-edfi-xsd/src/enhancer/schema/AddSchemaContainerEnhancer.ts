import R from 'ramda';
import { MetaEdEnvironment, EnhancerResult, TopLevelEntity, SemVer } from 'metaed-core';
import { getAllEntitiesOfType, orderByProp, V3OrGreater, versionSatisfies } from 'metaed-core';
import { TopLevelEntityEdfiXsd } from '../../model/TopLevelEntity';
import { NamespaceEdfiXsd } from '../../model/Namespace';
import { EnumerationBase, EnumerationBaseEdfiXsd } from '../../model/EnumerationBase';
import { SimpleTypeBase, SimpleTypeBaseEdfiXsd } from '../../model/SimpleTypeBase';
import { DescriptorEdfiXsd } from '../../model/Descriptor';
import { SchemaContainer } from '../../model/schema/SchemaContainer';
import { newSchemaContainer } from '../../model/schema/SchemaContainer';
import { SchemaSection } from '../../model/schema/SchemaSection';
import { newSchemaSection } from '../../model/schema/SchemaSection';
import { newAnnotation } from '../../model/schema/Annotation';
import { newAttribute } from '../../model/schema/Attribute';
import { newElement } from '../../model/schema/Element';
import { NoComplexType, newComplexType } from '../../model/schema/ComplexType';
import { NoSimpleType } from '../../model/schema/SimpleType';
import { NoEnumerationSimpleType } from '../../model/schema/EnumerationSimpleType';
import { NoStringSimpleType } from '../../model/schema/StringSimpleType';
import {
  createCodeValueSimpleType,
  createTimeIntervalSimpleType,
  createCurrencySimpleType,
  createPercentSimpleType,
  createDescriptorReferenceSimpleType,
} from './BaseSimpleTypeCreator';
import { baseTypeDescriptorReference, typeGroupBase } from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddSchemaContainerEnhancer';
const targetVersions: SemVer = V3OrGreater;

const complexTypesFrom = R.chain((x: TopLevelEntity) => (x.data.edfiXsd as TopLevelEntityEdfiXsd).xsdComplexTypes);
const extendedReferenceTypesFrom = R.map(
  (x: TopLevelEntity) => (x.data.edfiXsd as DescriptorEdfiXsd).xsdDescriptorExtendedReferenceType,
);
const simpleTypesFrom = R.map((x: SimpleTypeBase) => (x.data.edfiXsd as SimpleTypeBaseEdfiXsd).xsdSimpleType);
const enumerationSimpleTypesFrom = R.map(
  (x: EnumerationBase) => (x.data.edfiXsd as EnumerationBaseEdfiXsd).xsdEnumerationSimpleType,
);
const manyReferenceTypesFrom = R.chain((x: TopLevelEntity) => {
  const edfiXsd = x.data.edfiXsd as TopLevelEntityEdfiXsd;
  return [edfiXsd.xsdIdentityType, edfiXsd.xsdLookupType, edfiXsd.xsdReferenceType];
});

const removeNoComplexType = R.filter((x) => x !== NoComplexType);
const removeNoSimpleType = R.filter((x) => x !== NoSimpleType);
const removeNoEnumerationSimpleType = R.filter((x) => x !== NoEnumerationSimpleType);
const removeNoStringSimpleType = R.filter((x) => x !== NoStringSimpleType);

const inNamespace = (namespace) => R.filter((x) => x.namespace.namespaceName === namespace.namespaceName);

function baseSchemaSection() {
  const schemaSection: SchemaSection = {
    ...newSchemaSection(),
    sectionAnnotation: { ...newAnnotation(), documentation: '===== Base Types (borrowed from NEIM standards) =====' },
  };

  const complexObjectType = {
    ...newComplexType(),
    name: 'ComplexObjectType',
    isAbstract: true,
    annotation: {
      ...newAnnotation(),
      documentation: 'This is the base type from which all entity elements are extended.',
      typeGroup: typeGroupBase,
    },
    attributes: [
      {
        ...newAttribute(),
        name: 'id',
        type: 'xs:ID',
        annotation: { ...newAnnotation(), documentation: 'The XML ID associated with the complex object.' },
      },
    ],
  };
  schemaSection.complexTypes.push(complexObjectType);

  const descriptorType = {
    ...newComplexType(),
    name: 'DescriptorType',
    baseType: 'ComplexObjectType',
    isAbstract: true,
    annotation: { ...newAnnotation(), documentation: 'This is the base for the Descriptor type.', typeGroup: typeGroupBase },
    items: [
      {
        ...newElement(),
        name: 'CodeValue',
        type: 'CodeValue',
        annotation: { ...newAnnotation(), documentation: 'A code or abbreviation that is used to refer to the descriptor.' },
      },
      {
        ...newElement(),
        name: 'ShortDescription',
        type: 'ShortDescription',
        annotation: { ...newAnnotation(), documentation: 'A shortened description for the descriptor.' },
      },
      {
        ...newElement(),
        name: 'Description',
        type: 'Description',
        minOccurs: '0',
        annotation: { ...newAnnotation(), documentation: 'The description of the descriptor.' },
      },
      {
        ...newElement(),
        name: 'EffectiveBeginDate',
        type: 'xs:date',
        minOccurs: '0',
        annotation: {
          ...newAnnotation(),
          documentation:
            'The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness.',
        },
      },
      {
        ...newElement(),
        name: 'EffectiveEndDate',
        type: 'xs:date',
        minOccurs: '0',
        annotation: { ...newAnnotation(), documentation: 'The end date of the period when the descriptor is in effect.' },
      },
      {
        ...newElement(),
        name: 'PriorDescriptor',
        type: baseTypeDescriptorReference,
        minOccurs: '0',
        annotation: {
          ...newAnnotation(),
          documentation: 'Immediately prior to the date in Effective Date, the reference to the equivalent descriptor.',
        },
      },
      {
        ...newElement(),
        name: 'Namespace',
        type: 'URI',
        annotation: { ...newAnnotation(), documentation: 'A globally unique identifier for this descriptor.' },
      },
    ],
  };
  schemaSection.complexTypes.push(descriptorType);

  const referenceType = {
    ...newComplexType(),
    name: 'ReferenceType',
    annotation: {
      ...newAnnotation(),
      documentation: 'This is the base type for association references.',
      typeGroup: typeGroupBase,
    },
    attributes: [
      {
        ...newAttribute(),
        name: 'id',
        type: 'xs:ID',
        annotation: { ...newAnnotation(), documentation: 'The XML ID associated with this complex object.' },
      },
      {
        ...newAttribute(),
        name: 'ref',
        type: 'xs:IDREF',
        annotation: {
          ...newAnnotation(),
          documentation: 'The XML IDREF that references the object associated with this object.',
        },
      },
    ],
  };
  schemaSection.complexTypes.push(referenceType);

  return schemaSection;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace) => {
    const versionString = metaEd.dataStandardVersion;
    const schemaContainer: SchemaContainer = {
      ...newSchemaContainer(),
      isExtension: namespace.isExtension,
      schemaAnnotation: {
        ...newAnnotation(),
        documentation: namespace.isExtension
          ? `===== Ed-Fi ${versionString} Extensions =====`
          : `===== Ed-Fi-Core Version ${versionString} ====`,
      },
    };

    const complexTypesForEntitiesOfType = R.pipe(
      getAllEntitiesOfType,
      inNamespace(namespace),
      complexTypesFrom,
      removeNoComplexType,
      orderByProp('name'),
    );

    // Domain Entities
    const domainEntitiesSection: SchemaSection = {
      ...newSchemaSection(),
      sectionAnnotation: { ...newAnnotation(), documentation: '===== Domain Entities =====' },
      complexTypes: complexTypesForEntitiesOfType(metaEd, 'domainEntity', 'domainEntityExtension', 'domainEntitySubclass'),
    };
    schemaContainer.sections.push(domainEntitiesSection);

    // Descriptors
    const descriptorsSection: SchemaSection = {
      ...newSchemaSection(),
      sectionAnnotation: { ...newAnnotation(), documentation: '===== Descriptors =====' },
      complexTypes: complexTypesForEntitiesOfType(metaEd, 'descriptor'),
    };
    schemaContainer.sections.push(descriptorsSection);

    // Associations
    const associationsSection: SchemaSection = {
      ...newSchemaSection(),
      sectionAnnotation: { ...newAnnotation(), documentation: '===== Associations =====' },
      complexTypes: complexTypesForEntitiesOfType(metaEd, 'association', 'associationExtension', 'associationSubclass'),
    };
    schemaContainer.sections.push(associationsSection);

    // Base Types
    if (!namespace.isExtension) schemaContainer.sections.push(baseSchemaSection());

    // Extended Reference Types
    const manyReferenceTypesForEntitiesOfType = R.pipe(
      getAllEntitiesOfType,
      inNamespace(namespace),
      manyReferenceTypesFrom,
      removeNoComplexType,
      orderByProp('name'),
    );

    const extendedReferencesSection: SchemaSection = {
      ...newSchemaSection(),
      sectionAnnotation: { ...newAnnotation(), documentation: '===== Extended Reference Types =====' },
      complexTypes: manyReferenceTypesForEntitiesOfType(
        metaEd,
        'association',
        'associationExtension',
        'associationSubclass',
        'domainEntity',
        'domainEntityExtension',
        'domainEntitySubclass',
      ),
    };
    schemaContainer.sections.push(extendedReferencesSection);

    // Extended Descriptor Reference Types
    const referenceTypesForEntitiesOfType = R.pipe(
      getAllEntitiesOfType,
      inNamespace(namespace),
      extendedReferenceTypesFrom,
      removeNoStringSimpleType,
      orderByProp('name'),
    );

    const descriptorExtendedReferencesSection: SchemaSection = {
      ...newSchemaSection(),
      sectionAnnotation: { ...newAnnotation(), documentation: '===== Extended Descriptor Reference Types =====' },
      simpleTypes: referenceTypesForEntitiesOfType(metaEd, 'descriptor'),
    };
    schemaContainer.sections.push(descriptorExtendedReferencesSection);

    // Common Types
    const commonTypesSection: SchemaSection = {
      ...newSchemaSection(),
      sectionAnnotation: { ...newAnnotation(), documentation: '===== Common Types =====' },
      complexTypes: complexTypesForEntitiesOfType(metaEd, 'common', 'commonSubclass', 'commonExtension'),
    };
    schemaContainer.sections.push(commonTypesSection);

    // Enumerations and Enumerated Collections
    const enumerationSimpleTypesForEntitiesOfType = R.pipe(
      getAllEntitiesOfType,
      inNamespace(namespace),
      enumerationSimpleTypesFrom,
      removeNoEnumerationSimpleType,
      orderByProp('name'),
    );

    const enumerationsSection: SchemaSection = {
      ...newSchemaSection(),
      sectionAnnotation: { ...newAnnotation(), documentation: '===== Enumerations and Enumerated Collections =====' },
      simpleTypes: enumerationSimpleTypesForEntitiesOfType(
        metaEd,
        'enumeration',
        'mapTypeEnumeration',
        'schoolYearEnumeration',
      ),
    };
    schemaContainer.sections.push(enumerationsSection);

    // String Simple Types
    const simpleTypesForEntitiesOfType = R.pipe(
      getAllEntitiesOfType,
      inNamespace(namespace),
      simpleTypesFrom,
      removeNoSimpleType,
    );

    const stringSimpleTypes = simpleTypesForEntitiesOfType(metaEd, 'stringType');
    if (!namespace.isExtension) {
      stringSimpleTypes.push(
        createCodeValueSimpleType(),
        createDescriptorReferenceSimpleType(),
        createTimeIntervalSimpleType(),
      );
    }

    const stringSimpleTypesSection: SchemaSection = {
      ...newSchemaSection(),
      sectionAnnotation: { ...newAnnotation(), documentation: '===== String Simple Types =====' },
      simpleTypes: orderByProp('name')(stringSimpleTypes),
    };

    schemaContainer.sections.push(stringSimpleTypesSection);

    // Numeric Simple Types
    const numericSimpleTypes = simpleTypesForEntitiesOfType(metaEd, 'decimalType', 'integerType');
    if (!namespace.isExtension) {
      numericSimpleTypes.push(createCurrencySimpleType(), createPercentSimpleType());
    }

    const numericSimpleTypesSection: SchemaSection = {
      ...newSchemaSection(),
      sectionAnnotation: { ...newAnnotation(), documentation: '===== Numeric Simple Types =====' },
      simpleTypes: orderByProp('name')(numericSimpleTypes),
    };

    schemaContainer.sections.push(numericSimpleTypesSection);

    (namespace.data.edfiXsd as NamespaceEdfiXsd).xsdSchema = schemaContainer;
  });

  return {
    enhancerName,
    success: true,
  };
}
