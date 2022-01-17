import { Enhancer, Validator, MetaEdPlugin } from '@edfi/metaed-core';
import { newMetaEdPlugin } from '@edfi/metaed-core';

import { validate as abstractEntityMustContainAnIdentity } from './validator/AbstractEntity/AbstractEntityMustContainAnIdentity';
import { validate as abstractEntityMustNotBeExtended } from './validator/AbstractEntity/AbstractEntityMustNotBeExtended';
import { validate as abstractGeneralStudentProgramAssociationMustNotBeExtended } from './validator/AbstractEntity/AbstractGeneralStudentProgramAssociationMustNotBeExtended';

import { validate as associationExtensionMustNotBeInSameNamespaceAsBase } from './validator/AssociationExtension/AssociationExtensionMustNotBeInSameNamespaceAsBase';
import { validate as associationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass } from './validator/AssociationExtension/AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass';
import { validate as associationExtensionMustNotRedeclareProperties } from './validator/AssociationExtension/AssociationExtensionMustNotRedeclareProperties';

import { validate as associationPropertyMustMatchAnAssociation } from './validator/AssociationProperty/AssociationPropertyMustMatchAnAssociation';

import { validate as associationSubclassIdentifierMustMatchAnAssociation } from './validator/AssociationSubclass/AssociationSubclassIdentifierMustMatchAnAssociation';
import { validate as associationSubclassIdentityRenameMustExistNoMoreThanOnce } from './validator/AssociationSubclass/AssociationSubclassIdentityRenameMustExistNoMoreThanOnce';
import { validate as associationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass } from './validator/AssociationSubclass/AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass';
import { validate as associationSubclassMustNotRedeclareProperties } from './validator/AssociationSubclass/AssociationSubclassMustNotRedeclareProperties';

import { validate as choicePropertyMustMatchAChoice } from './validator/ChoiceProperty/ChoicePropertyMustMatchAChoice';

import { validate as commonExtensionExistsOnlyInExtensionNamespace } from './validator/CommonExtension/CommonExtensionExistsOnlyInExtensionNamespace';
import { validate as commonExtensionIdentifierMustMatchACommon } from './validator/CommonExtension/CommonExtensionIdentifierMustMatchACommon';
import { validate as commonExtensionMustNotRedeclareProperties } from './validator/CommonExtension/CommonExtensionMustNotRedeclareProperties';
import { validate as commonSubclassIdentifierMustMatchACommon } from './validator/CommonSubclass/CommonSubclassIdentifierMustMatchACommon';
import { validate as commonSubclassMustNotRedeclareProperties } from './validator/CommonSubclass/CommonSubclassMustNotRedeclareProperties';

import { validate as commonPropertyMustMatchACommon } from './validator/CommonProperty/CommonPropertyMustMatchACommon';
import { validate as commonPropertyMustNotContainIdentity } from './validator/CommonProperty/CommonPropertyMustNotContainIdentity';
import { validate as commonPropertyWithExtensionOverrideMustReferenceCommonTypeExtension } from './validator/CommonProperty/CommonPropertyWithExtensionOverrideMustReferenceCommonTypeExtension';
import { validate as commonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality } from './validator/CommonProperty/CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality';
import { validate as mostEntitiesCannotHaveSameName } from './validator/CrossEntity/MostEntitiesCannotHaveSameName';
import { validate as propertiesMustReferToValidNamespace } from './validator/CrossProperty/PropertiesMustReferToValidNamespace';

import { validate as decimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits } from './validator/DecimalProperty/DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits';
import { validate as decimalPropertyMinValueMustNotBeGreaterThanMaxValue } from './validator/DecimalProperty/DecimalPropertyMinValueMustNotBeGreaterThanMaxValue';
import { validate as decimalPropertyMustNotMatchASharedDecimal } from './validator/DecimalProperty/DecimalPropertyMustNotMatchASharedDecimal';
import { validate as decimalPropertyMustNotMatchASharedInteger } from './validator/DecimalProperty/DecimalPropertyMustNotMatchASharedInteger';
import { validate as decimalPropertyMustNotMatchASharedString } from './validator/DecimalProperty/DecimalPropertyMustNotMatchASharedString';

import { validate as descriptorMapTypeItemsMustBeUnique } from './validator/Descriptor/DescriptorMapTypeItemsMustBeUnique';
import { validate as descriptorNameCannotEndInDescriptor } from './validator/Descriptor/DescriptorNameCannotEndInDescriptor';
import { validate as descriptorNamesMustBeUnique } from './validator/Descriptor/DescriptorNamesMustBeUnique';
import { validate as descriptorMustNotHaveAttributes } from './validator/Descriptor/DescriptorMustNotHaveAttributes';

import { validate as descriptorPropertyMustMatchADescriptor } from './validator/DescriptorProperty/DescriptorPropertyMustMatchADescriptor';
import { validate as descriptorPropertyNameCannotEndInDescriptor } from './validator/DescriptorProperty/DescriptorPropertyNameCannotEndInDescriptor';

import { validate as associationDomainItemMustMatchTopLevelEntity } from './validator/Domain/AssociationDomainItemMustMatchTopLevelEntity';
import { validate as commonDomainItemMustMatchTopLevelEntity } from './validator/Domain/CommonDomainItemMustMatchTopLevelEntity';
import { validate as descriptorDomainItemMustMatchTopLevelEntity } from './validator/Domain/DescriptorDomainItemMustMatchTopLevelEntity';

// Temporarily comment out until METAED-697 fixed
// import { validate as domainEntityDomainItemMustMatchTopLevelEntity } from './validator/Domain/DomainEntityDomainItemMustMatchTopLevelEntity';
import { validate as domainMustNotDuplicateDomainItems } from './validator/Domain/DomainMustNotDuplicateDomainItems';
import { validate as inlineCommonDomainItemMustMatchTopLevelEntity } from './validator/Domain/InlineCommonDomainItemMustMatchTopLevelEntity';

import { validate as domainEntityMustContainAnIdentity } from './validator/DomainEntity/DomainEntityMustContainAnIdentity';
import { validate as domainEntityMustContainNoMoreThanOneUniqueIdColumn } from './validator/DomainEntity/DomainEntityMustContainNoMoreThanOneUniqueIdColumn';

import { validate as domainEntityExtensionMustNotBeInSameNamespaceAsBase } from './validator/DomainEntityExtension/DomainEntityExtensionMustNotBeInSameNamespaceAsBase';
import { validate as domainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass } from './validator/DomainEntityExtension/DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass';
import { validate as domainEntityExtensionMustNotRedeclareProperties } from './validator/DomainEntityExtension/DomainEntityExtensionMustNotRedeclareProperties';

import { validate as domainEntityPropertyMustMatchADomainEntity } from './validator/DomainEntityProperty/DomainEntityPropertyMustMatchADomainEntity';

import { validate as domainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity } from './validator/DomainEntitySubclass/DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity';
import { validate as domainEntitySubclassIdentityRenameMustExistNoMoreThanOnce } from './validator/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce';
import { validate as domainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass } from './validator/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass';
import { validate as domainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity } from './validator/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity';
import { validate as domainEntitySubclassMustNotRedeclareProperties } from './validator/DomainEntitySubclass/DomainEntitySubclassMustNotRedeclareProperties';

import { validate as enumerationItemsMustBeUnique } from './validator/Enumeration/EnumerationItemsMustBeUnique';
import { validate as enumerationExistsOnlyInCoreNamespace } from './validator/Enumeration/EnumerationExistsOnlyInCoreNamespace';

import { validate as enumerationPropertyMustMatchAnEnumeration } from './validator/EnumerationProperty/EnumerationPropertyMustMatchAnEnumeration';
import { validate as schoolYearEnumerationPropertyMustMatchAnEnumeration } from './validator/SchoolYearEnumerationProperty/SchoolYearEnumerationPropertyMustMatchASchoolYearEnumeration';

import { validate as identityExistsOnlyIfIdentityIsAllowed } from './validator/Identity/IdentityExistsOnlyIfIdentityIsAllowed';

import { validate as identityRenameExistsOnlyIfIdentityRenameIsAllowed } from './validator/IdentityRename/IdentityRenameExistsOnlyIfIdentityRenameIsAllowed';
import { validate as identityRenameTypeMustMatchBaseProperty } from './validator/IdentityRename/IdentityRenameTypeMustMatchBaseProperty';

import { validate as inlineCommonExistsOnlyInCoreNamespace } from './validator/InlineCommon/InlineCommonExistsOnlyInCoreNamespace';
import { validate as inlineCommonPropertyMustMatchAnInlineCommon } from './validator/InlineCommonProperty/InlineCommonPropertyMustMatchAnInlineCommon';
import { validate as inlineCommonPropertyMustNotBeACollection } from './validator/InlineCommonProperty/InlineCommonPropertyMustNotBeACollection';

import { validate as integerPropertyMinValueMustNotBeGreaterThanMaxValue } from './validator/IntegerProperty/IntegerPropertyMinValueMustNotBeGreaterThanMaxValue';
import { validate as integerPropertyMustNotMatchASharedDecimal } from './validator/IntegerProperty/IntegerPropertyMustNotMatchASharedDecimal';
import { validate as integerPropertyMustNotMatchASharedInteger } from './validator/IntegerProperty/IntegerPropertyMustNotMatchASharedInteger';
import { validate as integerPropertyMustNotMatchASharedString } from './validator/IntegerProperty/IntegerPropertyMustNotMatchASharedString';

import { validate as interchangeElementMustMatchADomainEntityOrAssociationOrSubclass } from './validator/Interchange/InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass';
import { validate as interchangeIdentityMustMatchADomainEntityOrAssociationOrSubclass } from './validator/Interchange/InterchangeIdentityMustMatchADomainEntityOrAssociationOrSubclass';
import { validate as interchangeMustNotRedeclareIdentityTemplates } from './validator/Interchange/InterchangeMustNotRedeclareIdentityTemplates';
import { validate as interchangeMustNotRedeclareInterchangeElements } from './validator/Interchange/InterchangeMustNotRedeclareInterchangeElements';

import { validate as interchangeExtensionIdentifierMustMatchAnInterchange } from './validator/InterchangeExtension/InterchangeExtensionIdentifierMustMatchAnInterchange';
import { validate as interchangeExtensionMustNotRedeclareBaseInterchangeElements } from './validator/InterchangeExtension/InterchangeExtensionMustNotRedeclareBaseInterchangeElements';
import { validate as interchangeExtensionMustNotRedeclareBaseInterchangeIdentityName } from './validator/InterchangeExtension/InterchangeExtensionMustNotRedeclareBaseInterchangeIdentityName';
import { validate as interchangeExtensionMustNotRedeclareElements } from './validator/InterchangeExtension/InterchangeExtensionMustNotRedeclareElements';
import { validate as interchangeExtensionMustNotRedeclareIdentityName } from './validator/InterchangeExtension/InterchangeExtensionMustNotRedeclareIdentityName';

import { validate as mergeDirectiveMustStartSourcePathWithPropertyName } from './validator/MergeDirective/MergeDirectiveMustStartSourcePathWithPropertyName';
import { validate as namespacesNamesMustNotHaveOnlyDifferentCasing } from './validator/Namespace/NamespacesNamesMustNotHaveOnlyDifferentCasing';

/*
import { validate as metaEdIdIsRequiredForDomainItems } from './validator/MetaEdId/MetaEdIdIsRequiredForDomainItems';
import { validate as metaEdIdIsRequiredForEntities } from './validator/MetaEdId/MetaEdIdIsRequiredForEntities';
import { validate as metaEdIdIsRequiredForEnumerationItems } from './validator/MetaEdId/MetaEdIdIsRequiredForEnumerationItems';
import { validate as metaEdIdIsRequiredForInterchangeItems } from './validator/MetaEdId/MetaEdIdIsRequiredForInterchangeItems';
import { validate as metaEdIdIsRequiredForProperties } from './validator/MetaEdId/MetaEdIdIsRequiredForProperties';
*/
import { validate as mustNotDuplicateMetaEdId } from './validator/MetaEdId/MustNotDuplicateMetaEdId';

import { validate as sharedDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits } from './validator/SharedDecimal/SharedDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits';
import { validate as sharedDecimalMinValueMustNotBeGreaterThanMaxValue } from './validator/SharedDecimal/SharedDecimalMinValueMustNotBeGreaterThanMaxValue';
import { validate as sharedIntegerMinValueMustNotBeGreaterThanMaxValue } from './validator/SharedInteger/SharedIntegerMinValueMustNotBeGreaterThanMaxValue';
import { validate as sharedStringMinLengthMustNotBeGreaterThanMaxLength } from './validator/SharedString/SharedStringMinLengthMustNotBeGreaterThanMaxLength';

import { validate as shortPropertyMinValueMustNotBeGreaterThanMaxValue } from './validator/ShortProperty/ShortPropertyMinValueMustNotBeGreaterThanMaxValue';
import { validate as shortPropertyMustNotMatchASharedDecimal } from './validator/ShortProperty/ShortPropertyMustNotMatchASharedDecimal';
import { validate as shortPropertyMustNotMatchASharedInteger } from './validator/ShortProperty/ShortPropertyMustNotMatchASharedInteger';
import { validate as shortPropertyMustNotMatchASharedString } from './validator/ShortProperty/ShortPropertyMustNotMatchASharedString';

import { validate as stringPropertyMinLengthMustNotBeGreaterThanMaxLength } from './validator/StringProperty/StringPropertyMinLengthMustNotBeGreaterThanMaxLength';
import { validate as stringPropertyMustNotMatchASharedDecimal } from './validator/StringProperty/StringPropertyMustNotMatchASharedDecimal';
import { validate as stringPropertyMustNotMatchASharedInteger } from './validator/StringProperty/StringPropertyMustNotMatchASharedInteger';
import { validate as stringPropertyMustNotMatchASharedString } from './validator/StringProperty/StringPropertyMustNotMatchASharedString';

import { validate as sharedDecimalPropertyMustMatchASharedDecimal } from './validator/SharedDecimalProperty/SharedDecimalPropertyMustMatchASharedDecimal';
import { validate as sharedIntegerPropertyMustMatchASharedInteger } from './validator/SharedIntegerProperty/SharedIntegerPropertyMustMatchASharedInteger';
import { validate as sharedShortPropertyMustMatchASharedShort } from './validator/SharedShortProperty/SharedShortPropertyMustMatchASharedShort';
import { validate as sharedStringPropertyMustMatchASharedString } from './validator/SharedStringProperty/SharedStringPropertyMustMatchASharedString';

import { validate as subdomainMustNotDuplicateDomainItems } from './validator/Subdomain/SubdomainMustNotDuplicateDomainItems';
import { validate as subdomainParentDomainNameMustMatchADomain } from './validator/Subdomain/SubdomainParentDomainNameMustMatchADomain';

import { enhance as abstractGeneralStudentProgramAssociationDiminisher } from './diminisher/AbstractGeneralStudentProgramAssociationDiminisher';

import { enhance as domainBaseEntityEnhancer } from './enhancer/DomainBaseEntityEnhancer';
import { enhance as subdomainParentEntityEnhancer } from './enhancer/SubdomainParentEntityEnhancer';
import { enhance as domainSubdomainEnhancer } from './enhancer/DomainSubdomainEnhancer';

import { enhance as associationExtensionBaseClassEnhancer } from './enhancer/AssociationExtensionBaseClassEnhancer';
import { enhance as associationSubclassBaseClassEnhancer } from './enhancer/AssociationSubclassBaseClassEnhancer';
import { enhance as commonExtensionBaseClassEnhancer } from './enhancer/CommonExtensionBaseClassEnhancer';
import { enhance as commonSubclassBaseClassEnhancer } from './enhancer/CommonSubclassBaseClassEnhancer';
import { enhance as domainEntityExtensionBaseClassEnhancer } from './enhancer/DomainEntityExtensionBaseClassEnhancer';
import { enhance as domainEntitySubclassBaseClassEnhancer } from './enhancer/DomainEntitySubclassBaseClassEnhancer';
import { enhance as interchangeExtensionBaseClassEnhancer } from './enhancer/InterchangeExtensionBaseClassEnhancer';
import { enhance as subclassQueryableEnhancer } from './enhancer/QueryableLookupSupport/SubclassQueryableEnhancer';

import { enhance as interchangeBaseItemEnhancer } from './enhancer/InterchangeBaseItemEnhancer';
import { enhance as associationReferenceEnhancer } from './enhancer/property/AssociationReferenceEnhancer';
import { enhance as choiceReferenceEnhancer } from './enhancer/property/ChoiceReferenceEnhancer';
import { enhance as commonReferenceEnhancer } from './enhancer/property/CommonReferenceEnhancer';
import { enhance as descriptorReferenceEnhancer } from './enhancer/property/DescriptorReferenceEnhancer';
import { enhance as domainEntityReferenceEnhancer } from './enhancer/property/DomainEntityReferenceEnhancer';
import { enhance as enumerationReferenceEnhancer } from './enhancer/property/EnumerationReferenceEnhancer';
import { enhance as inlineCommonReferenceEnhancer } from './enhancer/property/InlineCommonReferenceEnhancer';
import { enhance as schoolYearEnumerationReferenceEnhancer } from './enhancer/property/SchoolYearEnumerationReferenceEnhancer';

import { enhance as decimalReferenceEnhancer } from './enhancer/property/DecimalReferenceEnhancer';
import { enhance as integerReferenceEnhancer } from './enhancer/property/IntegerReferenceEnhancer';
import { enhance as shortReferenceEnhancer } from './enhancer/property/ShortReferenceEnhancer';
import { enhance as stringReferenceEnhancer } from './enhancer/property/StringReferenceEnhancer';

import { enhance as sharedDecimalPropertyEnhancer } from './enhancer/SharedDecimalPropertyEnhancer';
import { enhance as sharedIntegerPropertyEnhancer } from './enhancer/SharedIntegerPropertyEnhancer';
import { enhance as sharedStringPropertyEnhancer } from './enhancer/SharedStringPropertyEnhancer';

import { enhance as inheritedDocumentationCopyingEnhancer } from './enhancer/InheritedDocumentationCopyingEnhancer';

import { enhance as mergeDirectiveEnhancer } from './enhancer/MergeDirectiveEnhancer';

import { enhance as outReferencePathEnhancer } from './enhancer/OutReferencePathEnhancer';

export { enhance as outReferencePathEnhancer } from './enhancer/OutReferencePathEnhancer';
export { enhance as mergeDirectiveEnhancer } from './enhancer/MergeDirectiveEnhancer';
export { enhance as interchangeBaseItemEnhancer } from './enhancer/InterchangeBaseItemEnhancer';
export { enhance as domainBaseEntityEnhancer } from './enhancer/DomainBaseEntityEnhancer';
export { enhance as associationReferenceEnhancer } from './enhancer/property/AssociationReferenceEnhancer';
export { enhance as choiceReferenceEnhancer } from './enhancer/property/ChoiceReferenceEnhancer';
export { enhance as commonReferenceEnhancer } from './enhancer/property/CommonReferenceEnhancer';
export { enhance as descriptorReferenceEnhancer } from './enhancer/property/DescriptorReferenceEnhancer';
export { enhance as domainEntityReferenceEnhancer } from './enhancer/property/DomainEntityReferenceEnhancer';
export { enhance as enumerationReferenceEnhancer } from './enhancer/property/EnumerationReferenceEnhancer';
export { enhance as inlineCommonReferenceEnhancer } from './enhancer/property/InlineCommonReferenceEnhancer';

export { enhance as decimalReferenceEnhancer } from './enhancer/property/DecimalReferenceEnhancer';
export { enhance as integerReferenceEnhancer } from './enhancer/property/IntegerReferenceEnhancer';
export { enhance as shortReferenceEnhancer } from './enhancer/property/ShortReferenceEnhancer';
export { enhance as stringReferenceEnhancer } from './enhancer/property/StringReferenceEnhancer';

export { enhance as sharedDecimalPropertyEnhancer } from './enhancer/SharedDecimalPropertyEnhancer';
export { enhance as sharedIntegerPropertyEnhancer } from './enhancer/SharedIntegerPropertyEnhancer';
export { enhance as sharedStringPropertyEnhancer } from './enhancer/SharedStringPropertyEnhancer';

export { enhance as associationExtensionBaseClassEnhancer } from './enhancer/AssociationExtensionBaseClassEnhancer';
export { enhance as associationSubclassBaseClassEnhancer } from './enhancer/AssociationSubclassBaseClassEnhancer';
export { enhance as commonExtensionBaseClassEnhancer } from './enhancer/CommonExtensionBaseClassEnhancer';
export { enhance as commonSubclassBaseClassEnhancer } from './enhancer/CommonSubclassBaseClassEnhancer';
export { enhance as domainEntityExtensionBaseClassEnhancer } from './enhancer/DomainEntityExtensionBaseClassEnhancer';
export { enhance as domainEntitySubclassBaseClassEnhancer } from './enhancer/DomainEntitySubclassBaseClassEnhancer';
export { enhance as interchangeExtensionBaseClassEnhancer } from './enhancer/InterchangeExtensionBaseClassEnhancer';

function validatorList(): Validator[] {
  return [
    abstractEntityMustContainAnIdentity,
    abstractEntityMustNotBeExtended,
    abstractGeneralStudentProgramAssociationMustNotBeExtended,

    associationExtensionMustNotBeInSameNamespaceAsBase,
    associationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass,
    associationExtensionMustNotRedeclareProperties,

    associationPropertyMustMatchAnAssociation,

    associationSubclassIdentifierMustMatchAnAssociation,
    associationSubclassIdentityRenameMustExistNoMoreThanOnce,
    associationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass,
    associationSubclassMustNotRedeclareProperties,

    choicePropertyMustMatchAChoice,

    commonExtensionExistsOnlyInExtensionNamespace,
    commonExtensionIdentifierMustMatchACommon,
    commonExtensionMustNotRedeclareProperties,

    commonSubclassIdentifierMustMatchACommon,
    commonSubclassMustNotRedeclareProperties,

    commonPropertyMustMatchACommon,
    commonPropertyMustNotContainIdentity,
    commonPropertyWithExtensionOverrideMustReferenceCommonTypeExtension,
    commonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality,

    mostEntitiesCannotHaveSameName,
    propertiesMustReferToValidNamespace,

    decimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits,
    decimalPropertyMinValueMustNotBeGreaterThanMaxValue,
    decimalPropertyMustNotMatchASharedDecimal,
    decimalPropertyMustNotMatchASharedInteger,
    decimalPropertyMustNotMatchASharedString,

    descriptorMapTypeItemsMustBeUnique,
    descriptorNameCannotEndInDescriptor,
    descriptorNamesMustBeUnique,
    descriptorMustNotHaveAttributes,

    descriptorPropertyMustMatchADescriptor,
    descriptorPropertyNameCannotEndInDescriptor,

    associationDomainItemMustMatchTopLevelEntity,
    commonDomainItemMustMatchTopLevelEntity,
    descriptorDomainItemMustMatchTopLevelEntity,

    // Temporarily comment out until METAED-697 fixed
    // domainEntityDomainItemMustMatchTopLevelEntity,

    domainMustNotDuplicateDomainItems,
    inlineCommonDomainItemMustMatchTopLevelEntity,

    domainEntityMustContainAnIdentity,
    domainEntityMustContainNoMoreThanOneUniqueIdColumn,

    domainEntityExtensionMustNotBeInSameNamespaceAsBase,
    domainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass,
    domainEntityExtensionMustNotRedeclareProperties,

    domainEntityPropertyMustMatchADomainEntity,

    domainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity,
    domainEntitySubclassIdentityRenameMustExistNoMoreThanOnce,
    domainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass,
    domainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity,
    domainEntitySubclassMustNotRedeclareProperties,

    enumerationItemsMustBeUnique,
    enumerationExistsOnlyInCoreNamespace,

    enumerationPropertyMustMatchAnEnumeration,
    schoolYearEnumerationPropertyMustMatchAnEnumeration,

    identityExistsOnlyIfIdentityIsAllowed,

    identityRenameExistsOnlyIfIdentityRenameIsAllowed,
    identityRenameTypeMustMatchBaseProperty,

    inlineCommonExistsOnlyInCoreNamespace,
    inlineCommonPropertyMustMatchAnInlineCommon,
    inlineCommonPropertyMustNotBeACollection,

    integerPropertyMinValueMustNotBeGreaterThanMaxValue,
    integerPropertyMustNotMatchASharedDecimal,
    integerPropertyMustNotMatchASharedInteger,
    integerPropertyMustNotMatchASharedString,

    interchangeElementMustMatchADomainEntityOrAssociationOrSubclass,
    interchangeIdentityMustMatchADomainEntityOrAssociationOrSubclass,
    interchangeMustNotRedeclareIdentityTemplates,
    interchangeMustNotRedeclareInterchangeElements,

    interchangeExtensionIdentifierMustMatchAnInterchange,
    interchangeExtensionMustNotRedeclareBaseInterchangeElements,
    interchangeExtensionMustNotRedeclareBaseInterchangeIdentityName,
    interchangeExtensionMustNotRedeclareElements,
    interchangeExtensionMustNotRedeclareIdentityName,

    mergeDirectiveMustStartSourcePathWithPropertyName,

    // ////// Commenting out MetaEd ID required warnings -- imports commented out above
    // metaEdIdIsRequiredForDomainItems,
    // metaEdIdIsRequiredForEntities,
    // metaEdIdIsRequiredForEnumerationItems,
    // metaEdIdIsRequiredForInterchangeItems,
    // metaEdIdIsRequiredForProperties,
    mustNotDuplicateMetaEdId,

    namespacesNamesMustNotHaveOnlyDifferentCasing,

    sharedDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits,
    sharedDecimalMinValueMustNotBeGreaterThanMaxValue,
    sharedIntegerMinValueMustNotBeGreaterThanMaxValue,
    sharedStringMinLengthMustNotBeGreaterThanMaxLength,

    shortPropertyMinValueMustNotBeGreaterThanMaxValue,
    shortPropertyMustNotMatchASharedDecimal,
    shortPropertyMustNotMatchASharedInteger,
    shortPropertyMustNotMatchASharedString,

    stringPropertyMinLengthMustNotBeGreaterThanMaxLength,
    stringPropertyMustNotMatchASharedDecimal,
    stringPropertyMustNotMatchASharedInteger,
    stringPropertyMustNotMatchASharedString,

    sharedDecimalPropertyMustMatchASharedDecimal,
    sharedIntegerPropertyMustMatchASharedInteger,
    sharedShortPropertyMustMatchASharedShort,
    sharedStringPropertyMustMatchASharedString,

    subdomainMustNotDuplicateDomainItems,
    subdomainParentDomainNameMustMatchADomain,
  ];
}

function enhancerList(): Enhancer[] {
  return [
    // diminish :: () => isAbstract
    abstractGeneralStudentProgramAssociationDiminisher,

    // enhance :: () => domainItems.entities
    domainBaseEntityEnhancer,
    // enhance :: () => parent
    subdomainParentEntityEnhancer,
    // enhance :: () => domain.subdomains
    domainSubdomainEnhancer,

    // enhance :: () => baseEntity
    associationExtensionBaseClassEnhancer,
    associationSubclassBaseClassEnhancer,
    commonExtensionBaseClassEnhancer,
    commonSubclassBaseClassEnhancer,
    domainEntityExtensionBaseClassEnhancer,
    domainEntitySubclassBaseClassEnhancer,
    interchangeExtensionBaseClassEnhancer,

    // enhance :: (baseEntity) => queryableFields
    subclassQueryableEnhancer,

    // enhance :: () => elements.referencedEntity, IdentityTemplates.referencedEntity
    interchangeBaseItemEnhancer,

    // enhance :: () => referencedEntity
    associationReferenceEnhancer,
    choiceReferenceEnhancer,
    commonReferenceEnhancer,
    descriptorReferenceEnhancer,
    domainEntityReferenceEnhancer,
    enumerationReferenceEnhancer,
    inlineCommonReferenceEnhancer,
    schoolYearEnumerationReferenceEnhancer,

    // enhance :: () => referencedEntity, referencedEntity.referringSimpleProperties
    decimalReferenceEnhancer,
    integerReferenceEnhancer,
    shortReferenceEnhancer,
    stringReferenceEnhancer,

    // enhance :: (referencedEntity) => totalDigits, decimalPlaces, minValue, maxValue
    sharedDecimalPropertyEnhancer,
    // enhance :: (referencedEntity) => minValue, maxValue
    sharedIntegerPropertyEnhancer,
    // enhance :: (referencedEntity) => minLength, maxLength
    sharedStringPropertyEnhancer,

    // enhance :: (referencedEntity) => documentation
    inheritedDocumentationCopyingEnhancer,

    // enhance :: (referencedEntity, fullPropertyName) => mergeDirective.sourceProperty, mergeDirective.targetProperty
    mergeDirectiveEnhancer,

    outReferencePathEnhancer,
  ];
}

export function initialize(): MetaEdPlugin {
  return { ...newMetaEdPlugin(), validator: validatorList(), enhancer: enhancerList() };
}
