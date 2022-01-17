import { MetaEdPlugin } from '@edfi/metaed-core';
import { newMetaEdPlugin } from '@edfi/metaed-core';
import { validatorList } from './validator/ValidatorList';
import { enhancerList } from './enhancer/EnhancerList';
import { generate as DomainMetadataGenerator } from './generator/domainMetadata/DomainMetadataGenerator';
import { generate as ApiModelGenerator } from './generator/apiModel/ApiModelGenerator';
import { generate as EducationOrganizationReferenceMetadataGenerator } from './generator/educationOrganizationReferenceMetadata/EducationOrganizationReferenceMetadataGenerator';
import { generate as InterchangeOrderMetadataGenerator } from './generator/interchangeOrderMetadata/InterchangeOrderMetadataGenerator';

export function initialize(): MetaEdPlugin {
  return {
    ...newMetaEdPlugin(),
    validator: validatorList(),
    enhancer: enhancerList(),
    generator: [
      ApiModelGenerator,
      DomainMetadataGenerator,
      EducationOrganizationReferenceMetadataGenerator,
      InterchangeOrderMetadataGenerator,
    ],
  };
}
