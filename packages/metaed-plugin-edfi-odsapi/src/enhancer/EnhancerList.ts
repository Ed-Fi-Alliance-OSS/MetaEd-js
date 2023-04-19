import { Enhancer } from '@edfi/metaed-core';

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
import { enhance as associationDefinitionEnhancer } from './apiModel/AssociationDefinitionEnhancer';
import { enhance as associationDefinitionEnhancerV3dot2 } from './apiModel/AssociationDefinitionEnhancerV3dot2';
import { enhance as associationDefinitionEnhancerV5dot1 } from './apiModel/AssociationDefinitionEnhancerV5dot1';
import { enhance as associationDefinitionIsIdentifyingEnhancer } from './apiModel/AssociationDefinitionIsIdentifyingEnhancer';
import { enhance as associationDefinitionCardinalityEnhancer } from './apiModel/AssociationDefinitionCardinalityEnhancer';
import { enhance as associationDefinitionIsRequiredEnhancer } from './apiModel/AssociationDefinitionIsRequiredEnhancer';
import { enhance as associationDefinitionPrimaryEntityPropertyEnhancer } from './apiModel/AssociationDefinitionPrimaryEntityPropertyEnhancer';
import { enhance as associationDefinitionPrimaryEntityPropertyEnhancerV3 } from './apiModel/AssociationDefinitionPrimaryEntityPropertyEnhancerV3dot2';
import { enhance as associationDefinitionSecondaryEntityPropertyEnhancer } from './apiModel/AssociationDefinitionSecondaryEntityPropertyEnhancer';
import { enhance as associationDefinitionSecondaryEntityPropertyEnhancerV3 } from './apiModel/AssociationDefinitionSecondaryEntityPropertyEnhancerV3dot2';
import { enhance as entityDefinitionEnhancer } from './apiModel/EntityDefinitionEnhancer';
import { enhance as entityDefinitionEnhancerV3 } from './apiModel/EntityDefinitionEnhancerV3';
import { enhance as entityDefinitionIsAbstractEnhancer } from './apiModel/EntityDefinitionIsAbstractEnhancer';
import { enhance as entityDefinitionLocallyDefinedPropertyEnhancer } from './apiModel/EntityDefinitionLocallyDefinedPropertyEnhancer';
import { enhance as entityDefinitionLocallyDefinedPropertyEnhancerV3 } from './apiModel/EntityDefinitionLocallyDefinedPropertyEnhancerV3dot2';
import { enhance as entityDefinitionPredefinedPropertyEnhancer } from './apiModel/EntityDefinitionPredefinedPropertyEnhancer';
import { enhance as entityDefinitionPredefinedPropertyEnhancerV3 } from './apiModel/EntityDefinitionPredefinedPropertyEnhancerV3dot2';
import { enhance as entityDefinitionIdentifierEnhancer } from './apiModel/EntityDefinitionIdentifierEnhancer';
import { enhance as entityDefinitionIdentifierEnhancerV3 } from './apiModel/EntityDefinitionIdentifierEnhancerV3dot2';
import { enhance as entityDefinitionPropertyOrderEnhancer } from './apiModel/EntityDefinitionPropertyOrderEnhancer';

export function enhancerList(): Enhancer[] {
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
    associationDefinitionEnhancer,
    associationDefinitionEnhancerV3dot2,
    associationDefinitionEnhancerV5dot1,
    associationDefinitionIsIdentifyingEnhancer,
    associationDefinitionCardinalityEnhancer,
    associationDefinitionIsRequiredEnhancer,
    associationDefinitionPrimaryEntityPropertyEnhancer,
    associationDefinitionPrimaryEntityPropertyEnhancerV3,
    associationDefinitionSecondaryEntityPropertyEnhancer,
    associationDefinitionSecondaryEntityPropertyEnhancerV3,
    entityDefinitionEnhancer,
    entityDefinitionEnhancerV3,
    entityDefinitionIsAbstractEnhancer,
    entityDefinitionLocallyDefinedPropertyEnhancer,
    entityDefinitionLocallyDefinedPropertyEnhancerV3,
    entityDefinitionPredefinedPropertyEnhancer,
    entityDefinitionPredefinedPropertyEnhancerV3,
    entityDefinitionIdentifierEnhancer,
    entityDefinitionIdentifierEnhancerV3,
    entityDefinitionPropertyOrderEnhancer,
  ];
}
