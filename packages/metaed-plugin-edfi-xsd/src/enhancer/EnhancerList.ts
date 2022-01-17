import { Enhancer } from '@edfi/metaed-core';

import { enhance as edFiXsdEntityRepositorySetupEnhancer } from '../model/EdFiXsdEntityRepository';
import { enhance as choicePropertySetupEnhancer } from '../model/property/ChoiceProperty';
import { enhance as descriptorPropertySetupEnhancer } from '../model/property/DescriptorProperty';
import { enhance as entityPropertySetupEnhancer } from '../model/property/EntityProperty';

import { enhance as associationExtensionSetupEnhancer } from '../model/AssociationExtension';
import { enhance as commonExtensionSetupEnhancer } from '../model/CommonExtension';
import { enhance as commonSubclassSetupEnhancer } from '../model/CommonSubclass';
import { enhance as descriptorSetupEnhancer } from '../model/Descriptor';
import { enhance as domainEntitySetupEnhancer } from '../model/DomainEntity';
import { enhance as domainEntityExtensionSetupEnhancer } from '../model/DomainEntityExtension';
import { enhance as enumerationBaseSetupEnhancer } from '../model/EnumerationBase';
import { enhance as interchangeItemSetupEnhancer } from '../model/InterchangeItem';
import { enhance as modelBaseSetupEnhancer } from '../model/ModelBase';
import { enhance as namespaceSetupEnhancer } from '../model/Namespace';
import { enhance as simpleTypeBaseSetupEnhancer } from '../model/SimpleTypeBase';
import { enhance as topLevelEntitySetupEnhancer } from '../model/TopLevelEntity';

import { enhance as addChoicePropertiesEnhancer } from './AddChoicePropertiesEnhancer';
import { enhance as addDescriptorInterchangeEnhancer } from './AddDescriptorInterchangeEnhancer';
import { enhance as addInlineIdentityEnhancer } from './AddInlineIdentityEnhancer';
import { enhance as copyPropertiesEnhancer } from './CopyPropertiesEnhancer';
import { enhance as descriptorPropertiesEnhancer } from './DescriptorPropertiesEnhancer';
import { enhance as enumerationBasePropertiesEnhancer } from './EnumerationBasePropertiesEnhancer';
import { enhance as interchangeItemEnhancer } from './InterchangeItemEnhancer';
import { enhance as mergedInterchangeAdditionalPropertiesEnhancer } from './MergedInterchangeAdditionalPropertiesEnhancer';
import { enhance as mergedInterchangeElementOrderEnhancer } from './MergedInterchangeElementOrderEnhancer';
import { enhance as mergedInterchangeEnhancer } from './MergedInterchangeEnhancer';
import { enhance as mergedInterchangeExtensionEnhancer } from './MergedInterchangeExtensionEnhancer';

import { enhance as propertyEnhancer } from './PropertyEnhancer';
import { enhance as subclassIdentityEnhancer } from './SubclassIdentityEnhancer';

import { enhance as addAssociationComplexTypesEnhancer } from './schema/AddAssociationComplexTypesEnhancer';
import { enhance as addAssociationExtensionComplexTypesEnhancer } from './schema/AddAssociationExtensionComplexTypesEnhancer';
import { enhance as addAssociationSubclassComplexTypesEnhancer } from './schema/AddAssociationSubclassComplexTypesEnhancer';
import { enhance as addCommonComplexTypesEnhancer } from './schema/AddCommonComplexTypesEnhancer';
import { enhance as addCommonSubclassComplexTypesEnhancer } from './schema/AddCommonSubclassComplexTypesEnhancer';
import { enhance as addCommonExtensionComplexTypesEnhancer } from './schema/AddCommonExtensionComplexTypesEnhancer';
import { enhance as addDecimalSimpleTypesEnhancer } from './schema/AddDecimalSimpleTypesEnhancer';
import { enhance as addDescriptorComplexTypesEnhancer } from './schema/AddDescriptorComplexTypesEnhancer';
import { enhance as AddDescriptorComplexTypesEnhancerV2 } from './schema/AddDescriptorComplexTypesEnhancerV2';
import { enhance as AddDescriptorExtendedReferenceTypesEnhancer } from './schema/AddDescriptorExtendedReferenceTypesEnhancer';
import { enhance as addDomainEntityComplexTypesEnhancer } from './schema/AddDomainEntityComplexTypesEnhancer';
import { enhance as addDomainEntityExtensionComplexTypesEnhancer } from './schema/AddDomainEntityExtensionComplexTypesEnhancer';
import { enhance as addDomainEntitySubclassComplexTypesEnhancer } from './schema/AddDomainEntitySubclassComplexTypesEnhancer';
import { enhance as addEnumerationSimpleTypesEnhancer } from './schema/AddEnumerationSimpleTypesEnhancer';
import { enhance as addIntegerSimpleTypesEnhancer } from './schema/AddIntegerSimpleTypesEnhancer';
import { enhance as addStringSimpleTypesEnhancer } from './schema/AddStringSimpleTypesEnhancer';
import { enhance as addSchemaContainerEnhancer } from './schema/AddSchemaContainerEnhancer';
import { enhance as addSchemaContainerEnhancerV2 } from './schema/AddSchemaContainerEnhancerV2';

import { enhance as addLookupTypesDiminisher } from '../diminisher/AddLookupTypesDiminisher';
import { enhance as modifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher } from '../diminisher/ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher';
import { enhance as modifyDisciplineActionLengthToUseIntegerDiminisher } from '../diminisher/ModifyDisciplineActionLengthToUseIntegerDiminisher';
import { enhance as modifyEducationContentLearningResourceToInlineSequenceDiminisher } from '../diminisher/ModifyEducationContentLearningResourceToInlineSequenceDiminisher';
import { enhance as modifyIdentityTypeOrderToMatchLegacyOrderDiminisher } from '../diminisher/ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher';
import { enhance as modifyOrderOfPriorityToUsePositiveIntegerDiminisher } from '../diminisher/ModifyOrderOfPriorityToUsePositiveIntegerDiminisher';
import { enhance as modifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher } from '../diminisher/ModifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher';
import { enhance as modifyTotalInstructionalDaysToUseIntDiminisher } from '../diminisher/ModifyTotalInstructionalDaysToUseIntDiminisher';

import { enhance as hasDuplicateEntityNameInDependencyNamespaceEnhancer } from './HasDuplicateEntityNameInDependencyNamespaceEnhancer';

export function enhancerList(): Enhancer[] {
  return [
    // *********************
    // Plugin setup enhancer
    edFiXsdEntityRepositorySetupEnhancer,

    // ******************************
    // Property model setup enhancers
    choicePropertySetupEnhancer,
    descriptorPropertySetupEnhancer,
    entityPropertySetupEnhancer,

    // *********************
    // Model setup enhancers
    associationExtensionSetupEnhancer,
    commonExtensionSetupEnhancer,
    commonSubclassSetupEnhancer,
    descriptorSetupEnhancer,
    domainEntityExtensionSetupEnhancer,
    enumerationBaseSetupEnhancer,
    interchangeItemSetupEnhancer,
    modelBaseSetupEnhancer,
    namespaceSetupEnhancer,
    simpleTypeBaseSetupEnhancer,
    topLevelEntitySetupEnhancer,
    domainEntitySetupEnhancer,

    // ***************
    // Original XSD enhancers

    // XsdPropertyAssignmentPhase
    copyPropertiesEnhancer,
    descriptorPropertiesEnhancer,
    enumerationBasePropertiesEnhancer,
    propertyEnhancer,

    // XsdIdentityInlineCommonTypeReferencePhase
    addInlineIdentityEnhancer,

    // XsdIdentityParentPhase
    subclassIdentityEnhancer,

    // XsdDefaultPhase
    addChoicePropertiesEnhancer,

    // MergeInterchangePhase
    mergedInterchangeEnhancer,

    // AddDescriptorInterchangePhase
    addDescriptorInterchangeEnhancer,

    // ExtensionMergeInterchangePhase
    mergedInterchangeExtensionEnhancer,

    // EnhanceInterchangePhase
    interchangeItemEnhancer,
    mergedInterchangeAdditionalPropertiesEnhancer,

    // SchemaComponentPhase
    addAssociationComplexTypesEnhancer,
    addAssociationExtensionComplexTypesEnhancer,
    addAssociationSubclassComplexTypesEnhancer,
    addCommonComplexTypesEnhancer,
    addCommonExtensionComplexTypesEnhancer,
    addCommonSubclassComplexTypesEnhancer,
    addDescriptorComplexTypesEnhancer,
    AddDescriptorComplexTypesEnhancerV2,
    AddDescriptorExtendedReferenceTypesEnhancer,
    addDomainEntityComplexTypesEnhancer,
    addDomainEntityExtensionComplexTypesEnhancer,
    addDomainEntitySubclassComplexTypesEnhancer,
    addDecimalSimpleTypesEnhancer,
    addEnumerationSimpleTypesEnhancer,
    addIntegerSimpleTypesEnhancer,
    addStringSimpleTypesEnhancer,

    // DiminisherPhase
    addLookupTypesDiminisher,
    modifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher,
    modifyDisciplineActionLengthToUseIntegerDiminisher,
    modifyEducationContentLearningResourceToInlineSequenceDiminisher,
    modifyIdentityTypeOrderToMatchLegacyOrderDiminisher,
    modifyOrderOfPriorityToUsePositiveIntegerDiminisher,
    modifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher,
    modifyTotalInstructionalDaysToUseIntDiminisher,

    // SchemaCreationPhase
    addSchemaContainerEnhancer,
    addSchemaContainerEnhancerV2,

    // MergeInterchangeElementOrderPhase
    mergedInterchangeElementOrderEnhancer,

    hasDuplicateEntityNameInDependencyNamespaceEnhancer,
  ];
}
