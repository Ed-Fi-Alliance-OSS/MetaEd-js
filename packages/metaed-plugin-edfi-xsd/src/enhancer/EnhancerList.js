// @flow
import type { Enhancer } from '../../../metaed-core/index';

import { enhance as edFiXsdEntityRepositorySetupEnhancer } from '../model/EdFiXsdEntityRepository';
import { enhance as choicePropertySetupEnhancer } from '../model/property/ChoiceProperty';
import { enhance as descriptorPropertySetupEnhancer } from '../model/property/DescriptorProperty';
import { enhance as entityPropertySetupEnhancer } from '../model/property/EntityProperty';

import { enhance as associationExtensionSetupEnhancer } from '../model/AssociationExtension';
import { enhance as commonExtensionSetupEnhancer } from '../model/CommonExtension';
import { enhance as descriptorSetupEnhancer } from '../model/Descriptor';
import { enhance as domainEntitySetupEnhancer } from '../model/DomainEntity';
import { enhance as domainEntityExtensionSetupEnhancer } from '../model/DomainEntityExtension';
import { enhance as domainEntitySubclassSetupEnhancer } from '../model/DomainEntitySubclass';
import { enhance as enumerationBaseSetupEnhancer } from '../model/EnumerationBase';
import { enhance as interchangeItemSetupEnhancer } from '../model/InterchangeItem';
import { enhance as modelBaseSetupEnhancer } from '../model/ModelBase';
import { enhance as namespaceInfoSetupEnhancer } from '../model/NamespaceInfo';
import { enhance as simpleTypeBaseSetupEnhancer } from '../model/SimpleTypeBase';
import { enhance as topLevelEntitySetupEnhancer } from '../model/TopLevelEntity';

import { enhance as addChoicePropertiesEnhancer } from '../enhancer/AddChoicePropertiesEnhancer';
import { enhance as addDescriptorInterchangeEnhancer } from '../enhancer/AddDescriptorInterchangeEnhancer';
import { enhance as addInlineIdentityEnhancer } from '../enhancer/AddInlineIdentityEnhancer';
import { enhance as copyPropertiesEnhancer } from '../enhancer/CopyPropertiesEnhancer';
import { enhance as descriptorPropertiesEnhancer } from '../enhancer/DescriptorPropertiesEnhancer';
import { enhance as enumerationBasePropertiesEnhancer } from '../enhancer/EnumerationBasePropertiesEnhancer';
import { enhance as interchangeItemEnhancer } from '../enhancer/InterchangeItemEnhancer';
import { enhance as mergedInterchangeAdditionalPropertiesEnhancer } from '../enhancer/MergedInterchangeAdditionalPropertiesEnhancer';
import { enhance as mergedInterchangeElementOrderEnhancer } from '../enhancer/MergedInterchangeElementOrderEnhancer';
import { enhance as mergedInterchangeEnhancer } from '../enhancer/MergedInterchangeEnhancer';
import { enhance as mergedInterchangeExtensionEnhancer } from '../enhancer/MergedInterchangeExtensionEnhancer';
import { enhance as propertyEnhancer } from '../enhancer/PropertyEnhancer';
import { enhance as subclassIdentityEnhancer } from '../enhancer/SubclassIdentityEnhancer';

import { enhance as addAssociationComplexTypesEnhancer } from '../enhancer/schema/AddAssociationComplexTypesEnhancer';
import { enhance as addAssociationExtensionComplexTypesEnhancer } from '../enhancer/schema/AddAssociationExtensionComplexTypesEnhancer';
import { enhance as addAssociationSubclassComplexTypesEnhancer } from '../enhancer/schema/AddAssociationSubclassComplexTypesEnhancer';
import { enhance as addCommonComplexTypesEnhancer } from '../enhancer/schema/AddCommonComplexTypesEnhancer';
import { enhance as addCommonExtensionComplexTypesEnhancer } from '../enhancer/schema/AddCommonExtensionComplexTypesEnhancer';
import { enhance as addDecimalSimpleTypesEnhancer } from '../enhancer/schema/AddDecimalSimpleTypesEnhancer';
import { enhance as addDescriptorComplexTypesEnhancer } from '../enhancer/schema/AddDescriptorComplexTypesEnhancer';
import { enhance as addDomainEntityComplexTypesEnhancer } from '../enhancer/schema/AddDomainEntityComplexTypesEnhancer';
import { enhance as addDomainEntityExtensionComplexTypesEnhancer } from '../enhancer/schema/AddDomainEntityExtensionComplexTypesEnhancer';
import { enhance as addDomainEntitySubclassComplexTypesEnhancer } from '../enhancer/schema/AddDomainEntitySubclassComplexTypesEnhancer';
import { enhance as addEnumerationSimpleTypesEnhancer } from '../enhancer/schema/AddEnumerationSimpleTypesEnhancer';
import { enhance as addIntegerSimpleTypesEnhancer } from '../enhancer/schema/AddIntegerSimpleTypesEnhancer';
import { enhance as addStringSimpleTypesEnhancer } from '../enhancer/schema/AddStringSimpleTypesEnhancer';
import { enhance as addSchemaContainerEnhancer } from '../enhancer/schema/AddSchemaContainerEnhancer';

import { enhance as addLookupTypesDiminisher } from '../diminisher/AddLookupTypesDiminisher';
import { enhance as modifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher } from '../diminisher/ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher';
import { enhance as modifyDisciplineActionLengthToUseIntegerDiminisher } from '../diminisher/ModifyDisciplineActionLengthToUseIntegerDiminisher';
import { enhance as modifyEducationContentLearningResourceToInlineSequenceDiminisher } from '../diminisher/ModifyEducationContentLearningResourceToInlineSequenceDiminisher';
import { enhance as modifyIdentityTypeOrderToMatchLegacyOrderDiminisher } from '../diminisher/ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher';
import { enhance as modifyOrderOfPriorityToUsePositiveIntegerDiminisher } from '../diminisher/ModifyOrderOfPriorityToUsePositiveIntegerDiminisher';
import { enhance as modifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher } from '../diminisher/ModifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher';
import { enhance as modifyTotalInstructionalDaysToUseIntDiminisher } from '../diminisher/ModifyTotalInstructionalDaysToUseIntDiminisher';

export function enhancerList(): Array<Enhancer> {
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
    descriptorSetupEnhancer,
    domainEntitySetupEnhancer,
    domainEntityExtensionSetupEnhancer,
    domainEntitySubclassSetupEnhancer,
    enumerationBaseSetupEnhancer,
    interchangeItemSetupEnhancer,
    modelBaseSetupEnhancer,
    namespaceInfoSetupEnhancer,
    simpleTypeBaseSetupEnhancer,
    topLevelEntitySetupEnhancer,

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
    addDescriptorComplexTypesEnhancer,
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

    // MergeInterchangeElementOrderPhase
    mergedInterchangeElementOrderEnhancer,
  ];
}
