import { String as sugar } from 'sugar';
import { MetaEdEnvironment, EnhancerResult, Descriptor, SemVer } from '@edfi/metaed-core';
import { NoMapTypeEnumeration, versionSatisfies, V2Only, getAllEntitiesOfType } from '@edfi/metaed-core';
import { ComplexType } from '../../model/schema/ComplexType';
import { newComplexType } from '../../model/schema/ComplexType';
import { newAnnotation } from '../../model/schema/Annotation';
import { newElement } from '../../model/schema/Element';
import { createSchemaComplexTypeItems } from './XsdElementFromPropertyCreator';
import {
  typeGroupDescriptorExtendedReference,
  baseTypeDescriptorReference,
  typeGroupDescriptor,
  baseTypeDescriptor,
} from './AddComplexTypesBaseEnhancer';
import { ComplexTypeItem } from '../../model/schema/ComplexTypeItem';

const enhancerName = 'AddDescriptorComplexTypesEnhancerV2';
const targetVersions: SemVer = V2Only;

function createComplexType(descriptor: Descriptor): ComplexType[] {
  const complexType = {
    ...newComplexType(),
    annotation: { ...newAnnotation(), documentation: descriptor.documentation, typeGroup: typeGroupDescriptor },
    baseType: baseTypeDescriptor,
    name: descriptor.data.edfiXsd.xsdDescriptorNameWithExtension,
  };

  complexType.items.push(...createSchemaComplexTypeItems(descriptor.data.edfiXsd.xsdProperties()));
  if (descriptor.mapTypeEnumeration !== NoMapTypeEnumeration) {
    complexType.items.push({
      ...newElement(),
      name: descriptor.mapTypeEnumeration.metaEdName,
      type: descriptor.mapTypeEnumeration.data.edfiXsd.xsdEnumerationNameWithExtension,
      annotation: { ...newAnnotation(), documentation: `The mapping to a known ${descriptor.metaEdName} enumeration type.` },
      minOccurs: descriptor.isMapTypeOptional ? '0' : '',
    } as ComplexTypeItem);
  }
  return [complexType];
}

function createReferenceType(descriptor: Descriptor): ComplexType {
  return {
    ...newComplexType(),
    annotation: {
      ...newAnnotation(),
      documentation: `Provides references for ${sugar.spacify(
        descriptor.data.edfiXsd.xsdDescriptorName,
      )} and its details during interchange. Use XML IDREF to reference a record that is included in the interchange.`,
      typeGroup: typeGroupDescriptorExtendedReference,
    },
    baseType: baseTypeDescriptorReference,
    name: `${descriptor.data.edfiXsd.xsdDescriptorNameWithExtension}ReferenceType`,
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  (getAllEntitiesOfType(metaEd, 'descriptor') as Descriptor[]).forEach((descriptor: Descriptor) => {
    descriptor.data.edfiXsd.xsdComplexTypes = createComplexType(descriptor);
    descriptor.data.edfiXsd.xsdReferenceType = createReferenceType(descriptor);
  });

  return {
    enhancerName,
    success: true,
  };
}
