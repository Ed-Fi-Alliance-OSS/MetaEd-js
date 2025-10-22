// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
import { enhance as topLevelEntityDomainEnhancer } from './apiModel/TopLevelEntityDomainEnhancer';

import { enhance as createDomainModelDefinitionEnhancer } from './apiModel/CreateDomainModelDefinitionEnhancer';
import { enhance as buildSchemaDefinitionEnhancer } from './apiModel/BuildSchemaDefinitionEnhancer';
import { enhance as associationDefinitionEnhancer } from './apiModel/AssociationDefinitionEnhancer';
import { enhance as associationDefinitionIsIdentifyingEnhancer } from './apiModel/AssociationDefinitionIsIdentifyingEnhancer';
import { enhance as associationDefinitionCardinalityEnhancer } from './apiModel/AssociationDefinitionCardinalityEnhancer';
import { enhance as associationDefinitionCardinalityEnhancerV6x } from './apiModel/AssociationDefinitionCardinalityEnhancerV6x';
import { enhance as associationDefinitionIsRequiredEnhancer } from './apiModel/AssociationDefinitionIsRequiredEnhancer';
import { enhance as associationDefinitionPrimaryEntityPropertyEnhancer } from './apiModel/AssociationDefinitionPrimaryEntityPropertyEnhancer';
import { enhance as associationDefinitionSecondaryEntityPropertyEnhancer } from './apiModel/AssociationDefinitionSecondaryEntityPropertyEnhancer';
import { enhance as entityDefinitionEnhancer } from './apiModel/EntityDefinitionEnhancer';

import { enhance as entityDefinitionIsAbstractEnhancer } from './apiModel/EntityDefinitionIsAbstractEnhancer';
import { enhance as entityDefinitionLocallyDefinedPropertyEnhancer } from './apiModel/EntityDefinitionLocallyDefinedPropertyEnhancer';
import { enhance as entityDefinitionPredefinedPropertyEnhancer } from './apiModel/EntityDefinitionPredefinedPropertyEnhancer';
import { enhance as entityDefinitionIdentifierEnhancer } from './apiModel/EntityDefinitionIdentifierEnhancer';
import { enhance as entityDefinitionPropertyOrderEnhancer } from './apiModel/EntityDefinitionPropertyOrderEnhancer';
import { enhance as entityDefinitionDomainEnhancer } from './apiModel/EntityDefinitionDomainEnhancer';

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
    topLevelEntityDomainEnhancer,

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
    buildSchemaDefinitionEnhancer,
    associationDefinitionEnhancer,
    associationDefinitionIsIdentifyingEnhancer,
    associationDefinitionCardinalityEnhancer,
    associationDefinitionCardinalityEnhancerV6x,
    associationDefinitionIsRequiredEnhancer,
    associationDefinitionPrimaryEntityPropertyEnhancer,
    associationDefinitionSecondaryEntityPropertyEnhancer,
    entityDefinitionEnhancer,
    entityDefinitionIsAbstractEnhancer,
    entityDefinitionLocallyDefinedPropertyEnhancer,
    entityDefinitionPredefinedPropertyEnhancer,
    entityDefinitionIdentifierEnhancer,
    entityDefinitionPropertyOrderEnhancer,
    entityDefinitionDomainEnhancer,
  ];
}
