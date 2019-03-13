// @flow
import type { Enhancer } from 'metaed-core';

import { enhance as associationAggregateEnhancer } from './domainMetadata/AssociationAggregateEnhancer';
import { enhance as associationExtensionAggregateEnhancer } from './domainMetadata/AssociationExtensionAggregateEnhancer';
import { enhance as associationSubclassAggregateEnhancer } from './domainMetadata/AssociationSubclassAggregateEnhancer';
import { enhance as baseDescriptorAggregateEnhancer } from './domainMetadata/BaseDescriptorAggregateEnhancer';
import { enhance as descriptorAggregateEnhancer } from './domainMetadata/DescriptorAggregateEnhancer';
import { enhance as domainEntityAggregateEnhancer } from './domainMetadata/DomainEntityAggregateEnhancer';
import { enhance as domainEntityExtensionAggregateEnhancer } from './domainMetadata/DomainEntityExtensionAggregateEnhancer';
import { enhance as domainEntitySubclassAggregateEnhancer } from './domainMetadata/DomainEntitySubclassAggregateEnhancer';
import { enhance as educationOrganizationReferenceEnhancer } from './educationOrganizationReferenceMetadata/EducationOrganizationReferenceEnhancer';
import { enhance as enumerationAggregateEnhancer } from './domainMetadata/EnumerationAggregateEnhancer';
import { enhance as interchangeOrderMetadataEnhancer } from './interchangeOrderMetadata/InterchangeOrderMetadataEnhancer';
import { enhance as schoolYearEnumerationAggregateEnhancer } from './domainMetadata/SchoolYearEnumerationAggregateEnhancer';

import { enhance as descriptorSetupEnhancer } from '../model/Descriptor';
import { enhance as interchangeItemSetupEnhancer } from '../model/InterchangeItem';
import { enhance as mergedInterchangeSetupEnhancer } from '../model/MergedInterchange';
import { enhance as namespaceSetupEnhancer } from '../model/Namespace';
import { enhance as topLevelEntitySetupEnhancer } from '../model/TopLevelEntity';

import { enhance as createDomainModelDefinitionEnhancer } from './apiModel/CreateDomainModelDefinitionEnhancer';
import { enhance as buildSchemaDefinitionEnhancerV3 } from './apiModel/BuildSchemaDefinitionEnhancerV3';
import { enhance as buildSchemaDefinitionEnhancer } from './apiModel/BuildSchemaDefinitionEnhancer';

import { enhance as moveFederalFundsDiminisher } from '../diminisher/domainMetadata/MoveFederalFundsDiminisher';

export function enhancerList(): Array<Enhancer> {
  return [
    // **************************
    // API Metadata Default Phase

    // Models
    descriptorSetupEnhancer,
    interchangeItemSetupEnhancer,
    mergedInterchangeSetupEnhancer,
    namespaceSetupEnhancer,
    topLevelEntitySetupEnhancer,

    // Domain Metadata
    associationAggregateEnhancer,
    associationExtensionAggregateEnhancer,
    associationSubclassAggregateEnhancer,
    baseDescriptorAggregateEnhancer,
    descriptorAggregateEnhancer,
    domainEntityAggregateEnhancer,
    domainEntityExtensionAggregateEnhancer,
    domainEntitySubclassAggregateEnhancer,
    enumerationAggregateEnhancer,
    interchangeOrderMetadataEnhancer,
    schoolYearEnumerationAggregateEnhancer,

    educationOrganizationReferenceEnhancer,
    // API Model
    createDomainModelDefinitionEnhancer,
    buildSchemaDefinitionEnhancerV3,
    buildSchemaDefinitionEnhancer,

    // **************************
    // API Metadata Diminish Phase
    moveFederalFundsDiminisher,
  ];
}
