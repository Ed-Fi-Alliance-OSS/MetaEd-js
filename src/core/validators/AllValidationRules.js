// @flow
import R from 'ramda';
import { newRepository } from './ValidationRuleRepository';
import type { ValidationRuleRepository } from './ValidationRuleRepository';

import { includeRule as AbstractEntityMustContainAnIdentity } from './AbstractEntity/AbstractEntityMustContainAnIdentity';
import { includeRule as AssociationMustNotDuplicateDomainEntityNames } from './Association/AssociationMustNotDuplicateDomainEntityNames';
import { includeRule as FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity } from './Association/FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity';
import { includeRule as FirstDomainEntityPropertyMustNotCollideWithOtherProperty } from './Association/FirstDomainEntityPropertyMustNotCollideWithOtherProperty';
import { includeRule as SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity } from './Association/SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity';
import { includeRule as SecondDomainEntityPropertyMustNotCollideWithOtherProperty } from './Association/SecondDomainEntityPropertyMustNotCollideWithOtherProperty';
import { includeRule as AssociationExtensionExistsOnlyInExtensionNamespace } from './AssociationExtension/AssociationExtensionExistsOnlyInExtensionNamespace';
import { includeRule as AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass } from './AssociationExtension/AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass';
import { includeRule as AssociationExtensionMustNotDuplicateAssociationPropertyName } from './AssociationExtension/AssociationExtensionMustNotDuplicateAssociationPropertyName';
import { includeRule as AssociationSubclassIdentifierMustMatchAnAssociation } from './AssociationSubclass/AssociationSubclassIdentifierMustMatchAnAssociation';
import { includeRule as AssociationSubclassIdentityRenameMustExistNoMoreThanOnce } from './AssociationSubclass/AssociationSubclassIdentityRenameMustExistNoMoreThanOnce';
import { includeRule as AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass } from './AssociationSubclass/AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass';
import { includeRule as AssociationSubclassMustNotDuplicateAssociationPropertyName } from './AssociationSubclass/AssociationSubclassMustNotDuplicateAssociationPropertyName';
import { includeRule as CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits } from './SharedSimpleType/SharedDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits';
import { includeRule as CommonDecimalMinValueMustNotBeGreaterThanMaxValue } from './SharedSimpleType/SharedDecimalMinValueMustNotBeGreaterThanMaxValue';
import { includeRule as CommonIntegerMinValueMustNotBeGreaterThanMaxValue } from './SharedSimpleType/SharedIntegerMinValueMustNotBeGreaterThanMaxValue';
import { includeRule as CommonShortMinValueMustNotBeGreaterThanMaxValue } from './SharedSimpleType/SharedShortMinValueMustNotBeGreaterThanMaxValue';
import { includeRule as CommonStringMinLengthMustNotBeGreaterThanMaxLength } from './SharedSimpleType/SharedStringMinLengthMustNotBeGreaterThanMaxLength';
import { includeRule as CommonTypeExtensionIdentifierMustMatchACommonType } from './CommonExtension/CommonExtensionIdentifierMustMatchACommonType';
import { includeRule as CommonTypeExtensionMustNotDuplicateCommonTypePropertyName } from './CommonExtension/CommonExtensionMustNotDuplicateCommonTypePropertyName';
import { includeRule as MostEntitiesCannotHaveSameName } from './CrossEntity/MostEntitiesCannotHaveSameName';
import { includeRule as DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits } from './DecimalProperty/DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits';
import { includeRule as DecimalPropertyMinValueMustNotBeGreaterThanMaxValue } from './DecimalProperty/DecimalPropertyMinValueMustNotBeGreaterThanMaxValue';
import { includeRule as DecimalPropertyMustNotMatchACommonSimpleType } from './DecimalProperty/DecimalPropertyMustNotMatchACommonSimpleType';
import { includeRule as DescriptorMapTypeItemsMustBeUnique } from './Descriptor/DescriptorMapTypeItemsMustBeUnique';
import { includeRule as DescriptorPropertyMustMatchADescriptor } from './DescriptorProperty/DescriptorPropertyMustMatchADescriptor';
import { includeRule as DomainItemMustMatchTopLevelEntity } from './Domain/DomainItemMustMatchTopLevelEntity';
import { includeRule as DomainMustNotDuplicateDomainItems } from './Domain/DomainMustNotDuplicateDomainItems';
import { includeRule as DomainEntityMustContainAnIdentity } from './DomainEntity/DomainEntityMustContainAnIdentity';
import { includeRule as DomainEntityMustContainNoMoreThanOneUniqueIdColumn } from './DomainEntity/DomainEntityMustContainNoMoreThanOneUniqueIdColumn';
import { includeRule as DomainEntityExtensionExistsOnlyInExtensionNamespace } from './DomainEntityExtension/DomainEntityExtensionExistsOnlyInExtensionNamespace';
import { includeRule as DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass } from './DomainEntityExtension/DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass';
import { includeRule as DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName } from './DomainEntityExtension/DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName';
import { includeRule as DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity } from './DomainEntitySubclass/DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity';
import { includeRule as DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce } from './DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce';
import { includeRule as DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass } from './DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass';
import { includeRule as DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity } from './DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity';
import { includeRule as DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName } from './DomainEntitySubclass/DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName';
import { includeRule as EnumerationItemsMustBeUnique } from './Enumeration/EnumerationItemsMustBeUnique';
import { includeRule as EnumerationPropertyMustMatchAnEnumeration } from './EnumerationProperty/EnumerationPropertyMustMatchAnEnumeration';
import { includeRule as IdentityExistsOnlyIfIdentityIsAllowed } from './Identity/IdentityExistsOnlyIfIdentityIsAllowed';
import { includeRule as IdentityRenameExistsOnlyIfIdentityRenameIsAllowed } from './IdentityRename/IdentityRenameExistsOnlyIfIdentityRenameIsAllowed';
import { includeRule as CommonPropertyMustMatchACommon } from './CommonProperty/CommonPropertyMustMatchACommon';
import { includeRule as CommonPropertyMustNotContainIdentity } from './CommonProperty/CommonPropertyMustNotContainIdentity';
import { includeRule as CommonPropertyWithExtensionOverrideMustReferenceCommonTypeExtension } from './CommonProperty/CommonPropertyWithExtensionOverrideMustReferenceCommonTypeExtension';
import { includeRule as CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality } from './CommonProperty/CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality';
import { includeRule as InlineCommonExistsOnlyInCoreNamespace } from './InlineCommon/InlineCommonExistsOnlyInCoreNamespace';
import { includeRule as IntegerPropertyMinValueMustNotBeGreaterThanMaxValue } from './IntegerProperty/IntegerPropertyMinValueMustNotBeGreaterThanMaxValue';
import { includeRule as IntegerPropertyMustNotMatchACommonSimpleType } from './IntegerProperty/IntegerPropertyMustNotMatchACommonSimpleType';
import { includeRule as InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass } from './Interchange/InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass';
import { includeRule as InterchangeIdentityMustMatchADomainEntityOrAssociationOrSubclass } from './Interchange/InterchangeIdentityMustMatchADomainEntityOrAssociationOrSubclass';
import { includeRule as InterchangeMustNotDuplicateIdentityName } from './Interchange/InterchangeMustNotDuplicateIdentityName';
import { includeRule as InterchangeMustNotDuplicateInterchangeElementName } from './Interchange/InterchangeMustNotDuplicateInterchangeElementName';
import { includeRule as InterchangeExtensionIdentifierMustMatchAnInterchange } from './InterchangeExtension/InterchangeExtensionIdentifierMustMatchAnInterchange';
import { includeRule as InterchangeExtensionMustNotDuplicateIdentityName } from './InterchangeExtension/InterchangeExtensionMustNotDuplicateIdentityName';
import { includeRule as InterchangeExtensionMustNotDuplicateInterchangeElementName } from './InterchangeExtension/InterchangeExtensionMustNotDuplicateInterchangeElementName';
import { includeRule as MergePartOfReferenceExistsOnlyInCoreNamespace } from './MergePartOfReference/MergePartOfReferenceExistsOnlyInCoreNamespace';
import { includeRule as MergePropertyAndTargetPropertyMustMatch } from './MergePartOfReference/MergePropertyAndTargetPropertyMustMatch';
import { includeRule as MergePropertyPathMustExist } from './MergePartOfReference/MergePropertyPathMustExist';
import { includeRule as MergeStatementMustStartMergePathWithPropertyName } from './MergePartOfReference/MergeStatementMustStartMergePathWithPropertyName';
import { includeRule as TargetPropertyPathMustExist } from './MergePartOfReference/TargetPropertyPathMustExist';
import { includeRule as MetaEdIdIsRequiredForEntities } from './MetaEdId/MetaEdIdIsRequiredForEntities';
import { includeRule as MetaEdIdIsRequiredForItems } from './MetaEdId/MetaEdIdIsRequiredForItems';
import { includeRule as MetaEdIdIsRequiredForProperties } from './MetaEdId/MetaEdIdIsRequiredForProperties';
import { includeRule as MustNotDuplicateMetaEdId } from './MetaEdId/MustNotDuplicateMetaEdId';
import { includeRule as ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract } from './ReferenceProperty/ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract';
import { includeRule as SharedDecimalPropertyTypeMustMatchASharedDecimal } from './SharedProperty/SharedDecimalPropertyTypeMustMatchASharedDecimal';
import { includeRule as SharedIntegerPropertyTypeMustMatchASharedInteger } from './SharedProperty/SharedIntegerPropertyTypeMustMatchASharedInteger';
import { includeRule as SharedShortPropertyTypeMustMatchASharedShort } from './SharedProperty/SharedShortPropertyTypeMustMatchASharedShort';
import { includeRule as SharedStringPropertyTypeMustMatchASharedString } from './SharedProperty/SharedStringPropertyTypeMustMatchASharedString';
import { includeRule as ShortPropertyMinValueMustNotBeGreaterThanMaxValue } from './ShortProperty/ShortPropertyMinValueMustNotBeGreaterThanMaxValue';
import { includeRule as ShortPropertyMustNotMatchACommonSimpleType } from './ShortProperty/ShortPropertyMustNotMatchACommonSimpleType';
import { includeRule as StringPropertyMinLengthMustNotBeGreaterThanMaxLength } from './StringProperty/StringPropertyMinLengthMustNotBeGreaterThanMaxLength';
import { includeRule as StringPropertyMustNotMatchACommonSimpleType } from './StringProperty/StringPropertyMustNotMatchACommonSimpleType';
import { includeRule as SubdomainMustNotDuplicateDomainItems } from './Subdomain/SubdomainMustNotDuplicateDomainItems';
import { includeRule as SubdomainParentDomainNameMustMatchADomain } from './Subdomain/SubdomainParentDomainNameMustMatchADomain';

export default function allValidationRules(): ValidationRuleRepository {
  const resolver = R.compose(
    AbstractEntityMustContainAnIdentity,
    AssociationMustNotDuplicateDomainEntityNames,
    FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity,
    FirstDomainEntityPropertyMustNotCollideWithOtherProperty,
    SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity,
    SecondDomainEntityPropertyMustNotCollideWithOtherProperty,
    AssociationExtensionExistsOnlyInExtensionNamespace,
    AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass,
    AssociationExtensionMustNotDuplicateAssociationPropertyName,
    AssociationSubclassIdentifierMustMatchAnAssociation,
    AssociationSubclassIdentityRenameMustExistNoMoreThanOnce,
    AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass,
    AssociationSubclassMustNotDuplicateAssociationPropertyName,
    CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits,
    CommonDecimalMinValueMustNotBeGreaterThanMaxValue,
    CommonIntegerMinValueMustNotBeGreaterThanMaxValue,
    CommonShortMinValueMustNotBeGreaterThanMaxValue,
    CommonStringMinLengthMustNotBeGreaterThanMaxLength,
    CommonTypeExtensionIdentifierMustMatchACommonType,
    CommonTypeExtensionMustNotDuplicateCommonTypePropertyName,
    MostEntitiesCannotHaveSameName,
    DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits,
    DecimalPropertyMinValueMustNotBeGreaterThanMaxValue,
    DecimalPropertyMustNotMatchACommonSimpleType,
    DescriptorMapTypeItemsMustBeUnique,
    DescriptorPropertyMustMatchADescriptor,
    DomainItemMustMatchTopLevelEntity,
    DomainMustNotDuplicateDomainItems,
    DomainEntityMustContainAnIdentity,
    DomainEntityMustContainNoMoreThanOneUniqueIdColumn,
    DomainEntityExtensionExistsOnlyInExtensionNamespace,
    DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass,
    DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName,
    DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity,
    DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce,
    DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass,
    DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity,
    DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName,
    EnumerationItemsMustBeUnique,
    EnumerationPropertyMustMatchAnEnumeration,
    IdentityExistsOnlyIfIdentityIsAllowed,
    IdentityRenameExistsOnlyIfIdentityRenameIsAllowed,
    CommonPropertyMustMatchACommon,
    CommonPropertyMustNotContainIdentity,
    CommonPropertyWithExtensionOverrideMustReferenceCommonTypeExtension,
    CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality,
    InlineCommonExistsOnlyInCoreNamespace,
    IntegerPropertyMinValueMustNotBeGreaterThanMaxValue,
    IntegerPropertyMustNotMatchACommonSimpleType,
    InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass,
    InterchangeIdentityMustMatchADomainEntityOrAssociationOrSubclass,
    InterchangeMustNotDuplicateIdentityName,
    InterchangeMustNotDuplicateInterchangeElementName,
    InterchangeExtensionIdentifierMustMatchAnInterchange,
    InterchangeExtensionMustNotDuplicateIdentityName,
    InterchangeExtensionMustNotDuplicateInterchangeElementName,
    MergePartOfReferenceExistsOnlyInCoreNamespace,
    MergePropertyAndTargetPropertyMustMatch,
    MergePropertyPathMustExist,
    MergeStatementMustStartMergePathWithPropertyName,
    TargetPropertyPathMustExist,
    MetaEdIdIsRequiredForEntities,
    MetaEdIdIsRequiredForItems,
    MetaEdIdIsRequiredForProperties,
    MustNotDuplicateMetaEdId,
    ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract,
    SharedDecimalPropertyTypeMustMatchASharedDecimal,
    SharedIntegerPropertyTypeMustMatchASharedInteger,
    SharedShortPropertyTypeMustMatchASharedShort,
    SharedStringPropertyTypeMustMatchASharedString,
    ShortPropertyMinValueMustNotBeGreaterThanMaxValue,
    ShortPropertyMustNotMatchACommonSimpleType,
    StringPropertyMinLengthMustNotBeGreaterThanMaxLength,
    StringPropertyMustNotMatchACommonSimpleType,
    SubdomainMustNotDuplicateDomainItems,
    SubdomainParentDomainNameMustMatchADomain,
  );

  return resolver(newRepository());
}
