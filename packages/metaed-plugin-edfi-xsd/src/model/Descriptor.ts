import { MetaEdEnvironment, EnhancerResult, Descriptor, getAllEntitiesOfType } from '@edfi/metaed-core';
import { StringSimpleType, NoStringSimpleType } from './schema/StringSimpleType';

export interface DescriptorEdfiXsd {
  xsdDescriptorName: string;
  xsdDescriptorNameWithExtension: string;
  xsdIsMapType: boolean;
  xsdHasPropertiesOrMapType: boolean;
  xsdDescriptorExtendedReferenceType: StringSimpleType;
}

const enhancerName = 'DescriptorSetupEnhancer';

export function addDescriptorEdfiXsdTo(descriptor: Descriptor) {
  if (descriptor.data.edfiXsd == null) descriptor.data.edfiXsd = {};

  Object.assign(descriptor.data.edfiXsd, {
    xsdDescriptorName: '',
    xsdDescriptorNameWithExtension: '',
    xsdIsMapType: false,
    xsdHasPropertiesOrMapType: false,
    xsdDescriptorExtendedReferenceType: NoStringSimpleType,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'descriptor') as Descriptor[]).forEach((descriptor: Descriptor) => {
    addDescriptorEdfiXsdTo(descriptor);
  });

  return {
    enhancerName,
    success: true,
  };
}
