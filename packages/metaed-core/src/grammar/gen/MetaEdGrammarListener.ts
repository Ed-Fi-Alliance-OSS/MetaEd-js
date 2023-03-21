// Generated from ./packages/metaed-core/src/grammar/language/MetaEdGrammar.g4 by ANTLR 4.12.0

import {ParseTreeListener} from "antlr4";


import { MetaEdContext } from "./MetaEdGrammar";
import { NamespaceContext } from "./MetaEdGrammar";
import { NamespaceTypeContext } from "./MetaEdGrammar";
import { TopLevelEntityContext } from "./MetaEdGrammar";
import { DeprecatedContext } from "./MetaEdGrammar";
import { PropertyDeprecatedContext } from "./MetaEdGrammar";
import { DocumentationContext } from "./MetaEdGrammar";
import { EnumerationItemDocumentationContext } from "./MetaEdGrammar";
import { MapTypeDocumentationContext } from "./MetaEdGrammar";
import { PropertyDocumentationContext } from "./MetaEdGrammar";
import { AbstractEntityContext } from "./MetaEdGrammar";
import { EntityConfigurationContext } from "./MetaEdGrammar";
import { CascadeUpdateContext } from "./MetaEdGrammar";
import { AssociationContext } from "./MetaEdGrammar";
import { DefiningDomainEntityContext } from "./MetaEdGrammar";
import { AssociationExtensionContext } from "./MetaEdGrammar";
import { AssociationSubclassContext } from "./MetaEdGrammar";
import { ChoiceContext } from "./MetaEdGrammar";
import { SharedDecimalContext } from "./MetaEdGrammar";
import { SharedIntegerContext } from "./MetaEdGrammar";
import { SharedShortContext } from "./MetaEdGrammar";
import { SharedStringContext } from "./MetaEdGrammar";
import { CommonContext } from "./MetaEdGrammar";
import { CommonExtensionContext } from "./MetaEdGrammar";
import { CommonSubclassContext } from "./MetaEdGrammar";
import { DescriptorContext } from "./MetaEdGrammar";
import { WithMapTypeContext } from "./MetaEdGrammar";
import { RequiredMapTypeContext } from "./MetaEdGrammar";
import { OptionalMapTypeContext } from "./MetaEdGrammar";
import { DomainContext } from "./MetaEdGrammar";
import { DomainItemContext } from "./MetaEdGrammar";
import { FooterDocumentationContext } from "./MetaEdGrammar";
import { DomainEntityContext } from "./MetaEdGrammar";
import { DomainEntityExtensionContext } from "./MetaEdGrammar";
import { DomainEntitySubclassContext } from "./MetaEdGrammar";
import { EnumerationContext } from "./MetaEdGrammar";
import { EnumerationItemContext } from "./MetaEdGrammar";
import { ShortDescriptionContext } from "./MetaEdGrammar";
import { InlineCommonContext } from "./MetaEdGrammar";
import { InterchangeContext } from "./MetaEdGrammar";
import { ExtendedDocumentationContext } from "./MetaEdGrammar";
import { UseCaseDocumentationContext } from "./MetaEdGrammar";
import { InterchangeComponentContext } from "./MetaEdGrammar";
import { InterchangeElementContext } from "./MetaEdGrammar";
import { InterchangeIdentityContext } from "./MetaEdGrammar";
import { InterchangeExtensionContext } from "./MetaEdGrammar";
import { InterchangeExtensionComponentContext } from "./MetaEdGrammar";
import { SubdomainContext } from "./MetaEdGrammar";
import { SubdomainPositionContext } from "./MetaEdGrammar";
import { MinValueContext } from "./MetaEdGrammar";
import { MaxValueContext } from "./MetaEdGrammar";
import { MinValueDecimalContext } from "./MetaEdGrammar";
import { MaxValueDecimalContext } from "./MetaEdGrammar";
import { DecimalValueContext } from "./MetaEdGrammar";
import { TotalDigitsContext } from "./MetaEdGrammar";
import { DecimalPlacesContext } from "./MetaEdGrammar";
import { CommonExtensionOverrideContext } from "./MetaEdGrammar";
import { PropertyAnnotationContext } from "./MetaEdGrammar";
import { IdentityContext } from "./MetaEdGrammar";
import { IdentityRenameContext } from "./MetaEdGrammar";
import { RequiredContext } from "./MetaEdGrammar";
import { OptionalContext } from "./MetaEdGrammar";
import { CollectionContext } from "./MetaEdGrammar";
import { RequiredCollectionContext } from "./MetaEdGrammar";
import { OptionalCollectionContext } from "./MetaEdGrammar";
import { IsQueryableOnlyContext } from "./MetaEdGrammar";
import { PropertyComponentsContext } from "./MetaEdGrammar";
import { IsQueryableFieldContext } from "./MetaEdGrammar";
import { RoleNameContext } from "./MetaEdGrammar";
import { MinLengthContext } from "./MetaEdGrammar";
import { MaxLengthContext } from "./MetaEdGrammar";
import { PropertyContext } from "./MetaEdGrammar";
import { BooleanPropertyContext } from "./MetaEdGrammar";
import { CurrencyPropertyContext } from "./MetaEdGrammar";
import { DatePropertyContext } from "./MetaEdGrammar";
import { DatetimePropertyContext } from "./MetaEdGrammar";
import { DecimalPropertyContext } from "./MetaEdGrammar";
import { DescriptorPropertyContext } from "./MetaEdGrammar";
import { DurationPropertyContext } from "./MetaEdGrammar";
import { EnumerationPropertyContext } from "./MetaEdGrammar";
import { CommonPropertyContext } from "./MetaEdGrammar";
import { InlineCommonPropertyContext } from "./MetaEdGrammar";
import { ChoicePropertyContext } from "./MetaEdGrammar";
import { IntegerPropertyContext } from "./MetaEdGrammar";
import { PercentPropertyContext } from "./MetaEdGrammar";
import { AssociationPropertyContext } from "./MetaEdGrammar";
import { DomainEntityPropertyContext } from "./MetaEdGrammar";
import { SharedDecimalPropertyContext } from "./MetaEdGrammar";
import { SharedIntegerPropertyContext } from "./MetaEdGrammar";
import { SharedShortPropertyContext } from "./MetaEdGrammar";
import { SharedStringPropertyContext } from "./MetaEdGrammar";
import { ShortPropertyContext } from "./MetaEdGrammar";
import { StringPropertyContext } from "./MetaEdGrammar";
import { TimePropertyContext } from "./MetaEdGrammar";
import { YearPropertyContext } from "./MetaEdGrammar";
import { IsWeakReferenceContext } from "./MetaEdGrammar";
import { PotentiallyLogicalContext } from "./MetaEdGrammar";
import { MergeDirectiveContext } from "./MetaEdGrammar";
import { SourcePropertyPathContext } from "./MetaEdGrammar";
import { TargetPropertyPathContext } from "./MetaEdGrammar";
import { PropertyPathContext } from "./MetaEdGrammar";
import { Signed_intContext } from "./MetaEdGrammar";
import { UnaryOperatorContext } from "./MetaEdGrammar";
import { AbstractEntityNameContext } from "./MetaEdGrammar";
import { AssociationNameContext } from "./MetaEdGrammar";
import { BaseKeyNameContext } from "./MetaEdGrammar";
import { BaseNameContext } from "./MetaEdGrammar";
import { BaseNamespaceContext } from "./MetaEdGrammar";
import { ChoiceNameContext } from "./MetaEdGrammar";
import { SharedDecimalNameContext } from "./MetaEdGrammar";
import { SharedIntegerNameContext } from "./MetaEdGrammar";
import { CommonNameContext } from "./MetaEdGrammar";
import { SharedShortNameContext } from "./MetaEdGrammar";
import { SharedStringNameContext } from "./MetaEdGrammar";
import { DescriptorNameContext } from "./MetaEdGrammar";
import { DomainNameContext } from "./MetaEdGrammar";
import { EntityNameContext } from "./MetaEdGrammar";
import { EnumerationNameContext } from "./MetaEdGrammar";
import { ExtendeeNameContext } from "./MetaEdGrammar";
import { ExtendeeNamespaceContext } from "./MetaEdGrammar";
import { InlineCommonNameContext } from "./MetaEdGrammar";
import { InterchangeNameContext } from "./MetaEdGrammar";
import { LocalBaseNameContext } from "./MetaEdGrammar";
import { LocalDomainItemNameContext } from "./MetaEdGrammar";
import { LocalExtendeeNameContext } from "./MetaEdGrammar";
import { LocalInterchangeItemNameContext } from "./MetaEdGrammar";
import { LocalPropertyNameContext } from "./MetaEdGrammar";
import { LocalPropertyTypeContext } from "./MetaEdGrammar";
import { ParentDomainNameContext } from "./MetaEdGrammar";
import { PropertyNameContext } from "./MetaEdGrammar";
import { PropertyNamespaceContext } from "./MetaEdGrammar";
import { RoleNameNameContext } from "./MetaEdGrammar";
import { SharedPropertyNameContext } from "./MetaEdGrammar";
import { SharedPropertyTypeContext } from "./MetaEdGrammar";
import { ShortenToNameContext } from "./MetaEdGrammar";
import { SimplePropertyNameContext } from "./MetaEdGrammar";
import { SubdomainNameContext } from "./MetaEdGrammar";
import { NamespaceNameContext } from "./MetaEdGrammar";
import { MetaEdIdContext } from "./MetaEdGrammar";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `MetaEdGrammar`.
 */
export default class MetaEdGrammarListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.metaEd`.
	 * @param ctx the parse tree
	 */
	enterMetaEd?: (ctx: MetaEdContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.metaEd`.
	 * @param ctx the parse tree
	 */
	exitMetaEd?: (ctx: MetaEdContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.namespace`.
	 * @param ctx the parse tree
	 */
	enterNamespace?: (ctx: NamespaceContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.namespace`.
	 * @param ctx the parse tree
	 */
	exitNamespace?: (ctx: NamespaceContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.namespaceType`.
	 * @param ctx the parse tree
	 */
	enterNamespaceType?: (ctx: NamespaceTypeContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.namespaceType`.
	 * @param ctx the parse tree
	 */
	exitNamespaceType?: (ctx: NamespaceTypeContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.topLevelEntity`.
	 * @param ctx the parse tree
	 */
	enterTopLevelEntity?: (ctx: TopLevelEntityContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.topLevelEntity`.
	 * @param ctx the parse tree
	 */
	exitTopLevelEntity?: (ctx: TopLevelEntityContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.deprecated`.
	 * @param ctx the parse tree
	 */
	enterDeprecated?: (ctx: DeprecatedContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.deprecated`.
	 * @param ctx the parse tree
	 */
	exitDeprecated?: (ctx: DeprecatedContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.propertyDeprecated`.
	 * @param ctx the parse tree
	 */
	enterPropertyDeprecated?: (ctx: PropertyDeprecatedContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.propertyDeprecated`.
	 * @param ctx the parse tree
	 */
	exitPropertyDeprecated?: (ctx: PropertyDeprecatedContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.documentation`.
	 * @param ctx the parse tree
	 */
	enterDocumentation?: (ctx: DocumentationContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.documentation`.
	 * @param ctx the parse tree
	 */
	exitDocumentation?: (ctx: DocumentationContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.enumerationItemDocumentation`.
	 * @param ctx the parse tree
	 */
	enterEnumerationItemDocumentation?: (ctx: EnumerationItemDocumentationContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.enumerationItemDocumentation`.
	 * @param ctx the parse tree
	 */
	exitEnumerationItemDocumentation?: (ctx: EnumerationItemDocumentationContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.mapTypeDocumentation`.
	 * @param ctx the parse tree
	 */
	enterMapTypeDocumentation?: (ctx: MapTypeDocumentationContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.mapTypeDocumentation`.
	 * @param ctx the parse tree
	 */
	exitMapTypeDocumentation?: (ctx: MapTypeDocumentationContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.propertyDocumentation`.
	 * @param ctx the parse tree
	 */
	enterPropertyDocumentation?: (ctx: PropertyDocumentationContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.propertyDocumentation`.
	 * @param ctx the parse tree
	 */
	exitPropertyDocumentation?: (ctx: PropertyDocumentationContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.abstractEntity`.
	 * @param ctx the parse tree
	 */
	enterAbstractEntity?: (ctx: AbstractEntityContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.abstractEntity`.
	 * @param ctx the parse tree
	 */
	exitAbstractEntity?: (ctx: AbstractEntityContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.entityConfiguration`.
	 * @param ctx the parse tree
	 */
	enterEntityConfiguration?: (ctx: EntityConfigurationContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.entityConfiguration`.
	 * @param ctx the parse tree
	 */
	exitEntityConfiguration?: (ctx: EntityConfigurationContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.cascadeUpdate`.
	 * @param ctx the parse tree
	 */
	enterCascadeUpdate?: (ctx: CascadeUpdateContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.cascadeUpdate`.
	 * @param ctx the parse tree
	 */
	exitCascadeUpdate?: (ctx: CascadeUpdateContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.association`.
	 * @param ctx the parse tree
	 */
	enterAssociation?: (ctx: AssociationContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.association`.
	 * @param ctx the parse tree
	 */
	exitAssociation?: (ctx: AssociationContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.definingDomainEntity`.
	 * @param ctx the parse tree
	 */
	enterDefiningDomainEntity?: (ctx: DefiningDomainEntityContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.definingDomainEntity`.
	 * @param ctx the parse tree
	 */
	exitDefiningDomainEntity?: (ctx: DefiningDomainEntityContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.associationExtension`.
	 * @param ctx the parse tree
	 */
	enterAssociationExtension?: (ctx: AssociationExtensionContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.associationExtension`.
	 * @param ctx the parse tree
	 */
	exitAssociationExtension?: (ctx: AssociationExtensionContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.associationSubclass`.
	 * @param ctx the parse tree
	 */
	enterAssociationSubclass?: (ctx: AssociationSubclassContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.associationSubclass`.
	 * @param ctx the parse tree
	 */
	exitAssociationSubclass?: (ctx: AssociationSubclassContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.choice`.
	 * @param ctx the parse tree
	 */
	enterChoice?: (ctx: ChoiceContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.choice`.
	 * @param ctx the parse tree
	 */
	exitChoice?: (ctx: ChoiceContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedDecimal`.
	 * @param ctx the parse tree
	 */
	enterSharedDecimal?: (ctx: SharedDecimalContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedDecimal`.
	 * @param ctx the parse tree
	 */
	exitSharedDecimal?: (ctx: SharedDecimalContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedInteger`.
	 * @param ctx the parse tree
	 */
	enterSharedInteger?: (ctx: SharedIntegerContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedInteger`.
	 * @param ctx the parse tree
	 */
	exitSharedInteger?: (ctx: SharedIntegerContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedShort`.
	 * @param ctx the parse tree
	 */
	enterSharedShort?: (ctx: SharedShortContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedShort`.
	 * @param ctx the parse tree
	 */
	exitSharedShort?: (ctx: SharedShortContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedString`.
	 * @param ctx the parse tree
	 */
	enterSharedString?: (ctx: SharedStringContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedString`.
	 * @param ctx the parse tree
	 */
	exitSharedString?: (ctx: SharedStringContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.common`.
	 * @param ctx the parse tree
	 */
	enterCommon?: (ctx: CommonContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.common`.
	 * @param ctx the parse tree
	 */
	exitCommon?: (ctx: CommonContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.commonExtension`.
	 * @param ctx the parse tree
	 */
	enterCommonExtension?: (ctx: CommonExtensionContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.commonExtension`.
	 * @param ctx the parse tree
	 */
	exitCommonExtension?: (ctx: CommonExtensionContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.commonSubclass`.
	 * @param ctx the parse tree
	 */
	enterCommonSubclass?: (ctx: CommonSubclassContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.commonSubclass`.
	 * @param ctx the parse tree
	 */
	exitCommonSubclass?: (ctx: CommonSubclassContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.descriptor`.
	 * @param ctx the parse tree
	 */
	enterDescriptor?: (ctx: DescriptorContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.descriptor`.
	 * @param ctx the parse tree
	 */
	exitDescriptor?: (ctx: DescriptorContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.withMapType`.
	 * @param ctx the parse tree
	 */
	enterWithMapType?: (ctx: WithMapTypeContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.withMapType`.
	 * @param ctx the parse tree
	 */
	exitWithMapType?: (ctx: WithMapTypeContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.requiredMapType`.
	 * @param ctx the parse tree
	 */
	enterRequiredMapType?: (ctx: RequiredMapTypeContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.requiredMapType`.
	 * @param ctx the parse tree
	 */
	exitRequiredMapType?: (ctx: RequiredMapTypeContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.optionalMapType`.
	 * @param ctx the parse tree
	 */
	enterOptionalMapType?: (ctx: OptionalMapTypeContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.optionalMapType`.
	 * @param ctx the parse tree
	 */
	exitOptionalMapType?: (ctx: OptionalMapTypeContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.domain`.
	 * @param ctx the parse tree
	 */
	enterDomain?: (ctx: DomainContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.domain`.
	 * @param ctx the parse tree
	 */
	exitDomain?: (ctx: DomainContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.domainItem`.
	 * @param ctx the parse tree
	 */
	enterDomainItem?: (ctx: DomainItemContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.domainItem`.
	 * @param ctx the parse tree
	 */
	exitDomainItem?: (ctx: DomainItemContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.footerDocumentation`.
	 * @param ctx the parse tree
	 */
	enterFooterDocumentation?: (ctx: FooterDocumentationContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.footerDocumentation`.
	 * @param ctx the parse tree
	 */
	exitFooterDocumentation?: (ctx: FooterDocumentationContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.domainEntity`.
	 * @param ctx the parse tree
	 */
	enterDomainEntity?: (ctx: DomainEntityContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.domainEntity`.
	 * @param ctx the parse tree
	 */
	exitDomainEntity?: (ctx: DomainEntityContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.domainEntityExtension`.
	 * @param ctx the parse tree
	 */
	enterDomainEntityExtension?: (ctx: DomainEntityExtensionContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.domainEntityExtension`.
	 * @param ctx the parse tree
	 */
	exitDomainEntityExtension?: (ctx: DomainEntityExtensionContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.domainEntitySubclass`.
	 * @param ctx the parse tree
	 */
	enterDomainEntitySubclass?: (ctx: DomainEntitySubclassContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.domainEntitySubclass`.
	 * @param ctx the parse tree
	 */
	exitDomainEntitySubclass?: (ctx: DomainEntitySubclassContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.enumeration`.
	 * @param ctx the parse tree
	 */
	enterEnumeration?: (ctx: EnumerationContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.enumeration`.
	 * @param ctx the parse tree
	 */
	exitEnumeration?: (ctx: EnumerationContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.enumerationItem`.
	 * @param ctx the parse tree
	 */
	enterEnumerationItem?: (ctx: EnumerationItemContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.enumerationItem`.
	 * @param ctx the parse tree
	 */
	exitEnumerationItem?: (ctx: EnumerationItemContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.shortDescription`.
	 * @param ctx the parse tree
	 */
	enterShortDescription?: (ctx: ShortDescriptionContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.shortDescription`.
	 * @param ctx the parse tree
	 */
	exitShortDescription?: (ctx: ShortDescriptionContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.inlineCommon`.
	 * @param ctx the parse tree
	 */
	enterInlineCommon?: (ctx: InlineCommonContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.inlineCommon`.
	 * @param ctx the parse tree
	 */
	exitInlineCommon?: (ctx: InlineCommonContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.interchange`.
	 * @param ctx the parse tree
	 */
	enterInterchange?: (ctx: InterchangeContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.interchange`.
	 * @param ctx the parse tree
	 */
	exitInterchange?: (ctx: InterchangeContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.extendedDocumentation`.
	 * @param ctx the parse tree
	 */
	enterExtendedDocumentation?: (ctx: ExtendedDocumentationContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.extendedDocumentation`.
	 * @param ctx the parse tree
	 */
	exitExtendedDocumentation?: (ctx: ExtendedDocumentationContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.useCaseDocumentation`.
	 * @param ctx the parse tree
	 */
	enterUseCaseDocumentation?: (ctx: UseCaseDocumentationContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.useCaseDocumentation`.
	 * @param ctx the parse tree
	 */
	exitUseCaseDocumentation?: (ctx: UseCaseDocumentationContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.interchangeComponent`.
	 * @param ctx the parse tree
	 */
	enterInterchangeComponent?: (ctx: InterchangeComponentContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.interchangeComponent`.
	 * @param ctx the parse tree
	 */
	exitInterchangeComponent?: (ctx: InterchangeComponentContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.interchangeElement`.
	 * @param ctx the parse tree
	 */
	enterInterchangeElement?: (ctx: InterchangeElementContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.interchangeElement`.
	 * @param ctx the parse tree
	 */
	exitInterchangeElement?: (ctx: InterchangeElementContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.interchangeIdentity`.
	 * @param ctx the parse tree
	 */
	enterInterchangeIdentity?: (ctx: InterchangeIdentityContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.interchangeIdentity`.
	 * @param ctx the parse tree
	 */
	exitInterchangeIdentity?: (ctx: InterchangeIdentityContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.interchangeExtension`.
	 * @param ctx the parse tree
	 */
	enterInterchangeExtension?: (ctx: InterchangeExtensionContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.interchangeExtension`.
	 * @param ctx the parse tree
	 */
	exitInterchangeExtension?: (ctx: InterchangeExtensionContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.interchangeExtensionComponent`.
	 * @param ctx the parse tree
	 */
	enterInterchangeExtensionComponent?: (ctx: InterchangeExtensionComponentContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.interchangeExtensionComponent`.
	 * @param ctx the parse tree
	 */
	exitInterchangeExtensionComponent?: (ctx: InterchangeExtensionComponentContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.subdomain`.
	 * @param ctx the parse tree
	 */
	enterSubdomain?: (ctx: SubdomainContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.subdomain`.
	 * @param ctx the parse tree
	 */
	exitSubdomain?: (ctx: SubdomainContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.subdomainPosition`.
	 * @param ctx the parse tree
	 */
	enterSubdomainPosition?: (ctx: SubdomainPositionContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.subdomainPosition`.
	 * @param ctx the parse tree
	 */
	exitSubdomainPosition?: (ctx: SubdomainPositionContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.minValue`.
	 * @param ctx the parse tree
	 */
	enterMinValue?: (ctx: MinValueContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.minValue`.
	 * @param ctx the parse tree
	 */
	exitMinValue?: (ctx: MinValueContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.maxValue`.
	 * @param ctx the parse tree
	 */
	enterMaxValue?: (ctx: MaxValueContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.maxValue`.
	 * @param ctx the parse tree
	 */
	exitMaxValue?: (ctx: MaxValueContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.minValueDecimal`.
	 * @param ctx the parse tree
	 */
	enterMinValueDecimal?: (ctx: MinValueDecimalContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.minValueDecimal`.
	 * @param ctx the parse tree
	 */
	exitMinValueDecimal?: (ctx: MinValueDecimalContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.maxValueDecimal`.
	 * @param ctx the parse tree
	 */
	enterMaxValueDecimal?: (ctx: MaxValueDecimalContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.maxValueDecimal`.
	 * @param ctx the parse tree
	 */
	exitMaxValueDecimal?: (ctx: MaxValueDecimalContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.decimalValue`.
	 * @param ctx the parse tree
	 */
	enterDecimalValue?: (ctx: DecimalValueContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.decimalValue`.
	 * @param ctx the parse tree
	 */
	exitDecimalValue?: (ctx: DecimalValueContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.totalDigits`.
	 * @param ctx the parse tree
	 */
	enterTotalDigits?: (ctx: TotalDigitsContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.totalDigits`.
	 * @param ctx the parse tree
	 */
	exitTotalDigits?: (ctx: TotalDigitsContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.decimalPlaces`.
	 * @param ctx the parse tree
	 */
	enterDecimalPlaces?: (ctx: DecimalPlacesContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.decimalPlaces`.
	 * @param ctx the parse tree
	 */
	exitDecimalPlaces?: (ctx: DecimalPlacesContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.commonExtensionOverride`.
	 * @param ctx the parse tree
	 */
	enterCommonExtensionOverride?: (ctx: CommonExtensionOverrideContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.commonExtensionOverride`.
	 * @param ctx the parse tree
	 */
	exitCommonExtensionOverride?: (ctx: CommonExtensionOverrideContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.propertyAnnotation`.
	 * @param ctx the parse tree
	 */
	enterPropertyAnnotation?: (ctx: PropertyAnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.propertyAnnotation`.
	 * @param ctx the parse tree
	 */
	exitPropertyAnnotation?: (ctx: PropertyAnnotationContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.identity`.
	 * @param ctx the parse tree
	 */
	enterIdentity?: (ctx: IdentityContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.identity`.
	 * @param ctx the parse tree
	 */
	exitIdentity?: (ctx: IdentityContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.identityRename`.
	 * @param ctx the parse tree
	 */
	enterIdentityRename?: (ctx: IdentityRenameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.identityRename`.
	 * @param ctx the parse tree
	 */
	exitIdentityRename?: (ctx: IdentityRenameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.required`.
	 * @param ctx the parse tree
	 */
	enterRequired?: (ctx: RequiredContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.required`.
	 * @param ctx the parse tree
	 */
	exitRequired?: (ctx: RequiredContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.optional`.
	 * @param ctx the parse tree
	 */
	enterOptional?: (ctx: OptionalContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.optional`.
	 * @param ctx the parse tree
	 */
	exitOptional?: (ctx: OptionalContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.collection`.
	 * @param ctx the parse tree
	 */
	enterCollection?: (ctx: CollectionContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.collection`.
	 * @param ctx the parse tree
	 */
	exitCollection?: (ctx: CollectionContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.requiredCollection`.
	 * @param ctx the parse tree
	 */
	enterRequiredCollection?: (ctx: RequiredCollectionContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.requiredCollection`.
	 * @param ctx the parse tree
	 */
	exitRequiredCollection?: (ctx: RequiredCollectionContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.optionalCollection`.
	 * @param ctx the parse tree
	 */
	enterOptionalCollection?: (ctx: OptionalCollectionContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.optionalCollection`.
	 * @param ctx the parse tree
	 */
	exitOptionalCollection?: (ctx: OptionalCollectionContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.isQueryableOnly`.
	 * @param ctx the parse tree
	 */
	enterIsQueryableOnly?: (ctx: IsQueryableOnlyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.isQueryableOnly`.
	 * @param ctx the parse tree
	 */
	exitIsQueryableOnly?: (ctx: IsQueryableOnlyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.propertyComponents`.
	 * @param ctx the parse tree
	 */
	enterPropertyComponents?: (ctx: PropertyComponentsContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.propertyComponents`.
	 * @param ctx the parse tree
	 */
	exitPropertyComponents?: (ctx: PropertyComponentsContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.isQueryableField`.
	 * @param ctx the parse tree
	 */
	enterIsQueryableField?: (ctx: IsQueryableFieldContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.isQueryableField`.
	 * @param ctx the parse tree
	 */
	exitIsQueryableField?: (ctx: IsQueryableFieldContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.roleName`.
	 * @param ctx the parse tree
	 */
	enterRoleName?: (ctx: RoleNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.roleName`.
	 * @param ctx the parse tree
	 */
	exitRoleName?: (ctx: RoleNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.minLength`.
	 * @param ctx the parse tree
	 */
	enterMinLength?: (ctx: MinLengthContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.minLength`.
	 * @param ctx the parse tree
	 */
	exitMinLength?: (ctx: MinLengthContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.maxLength`.
	 * @param ctx the parse tree
	 */
	enterMaxLength?: (ctx: MaxLengthContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.maxLength`.
	 * @param ctx the parse tree
	 */
	exitMaxLength?: (ctx: MaxLengthContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.property`.
	 * @param ctx the parse tree
	 */
	enterProperty?: (ctx: PropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.property`.
	 * @param ctx the parse tree
	 */
	exitProperty?: (ctx: PropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.booleanProperty`.
	 * @param ctx the parse tree
	 */
	enterBooleanProperty?: (ctx: BooleanPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.booleanProperty`.
	 * @param ctx the parse tree
	 */
	exitBooleanProperty?: (ctx: BooleanPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.currencyProperty`.
	 * @param ctx the parse tree
	 */
	enterCurrencyProperty?: (ctx: CurrencyPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.currencyProperty`.
	 * @param ctx the parse tree
	 */
	exitCurrencyProperty?: (ctx: CurrencyPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.dateProperty`.
	 * @param ctx the parse tree
	 */
	enterDateProperty?: (ctx: DatePropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.dateProperty`.
	 * @param ctx the parse tree
	 */
	exitDateProperty?: (ctx: DatePropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.datetimeProperty`.
	 * @param ctx the parse tree
	 */
	enterDatetimeProperty?: (ctx: DatetimePropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.datetimeProperty`.
	 * @param ctx the parse tree
	 */
	exitDatetimeProperty?: (ctx: DatetimePropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.decimalProperty`.
	 * @param ctx the parse tree
	 */
	enterDecimalProperty?: (ctx: DecimalPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.decimalProperty`.
	 * @param ctx the parse tree
	 */
	exitDecimalProperty?: (ctx: DecimalPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.descriptorProperty`.
	 * @param ctx the parse tree
	 */
	enterDescriptorProperty?: (ctx: DescriptorPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.descriptorProperty`.
	 * @param ctx the parse tree
	 */
	exitDescriptorProperty?: (ctx: DescriptorPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.durationProperty`.
	 * @param ctx the parse tree
	 */
	enterDurationProperty?: (ctx: DurationPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.durationProperty`.
	 * @param ctx the parse tree
	 */
	exitDurationProperty?: (ctx: DurationPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.enumerationProperty`.
	 * @param ctx the parse tree
	 */
	enterEnumerationProperty?: (ctx: EnumerationPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.enumerationProperty`.
	 * @param ctx the parse tree
	 */
	exitEnumerationProperty?: (ctx: EnumerationPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.commonProperty`.
	 * @param ctx the parse tree
	 */
	enterCommonProperty?: (ctx: CommonPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.commonProperty`.
	 * @param ctx the parse tree
	 */
	exitCommonProperty?: (ctx: CommonPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.inlineCommonProperty`.
	 * @param ctx the parse tree
	 */
	enterInlineCommonProperty?: (ctx: InlineCommonPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.inlineCommonProperty`.
	 * @param ctx the parse tree
	 */
	exitInlineCommonProperty?: (ctx: InlineCommonPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.choiceProperty`.
	 * @param ctx the parse tree
	 */
	enterChoiceProperty?: (ctx: ChoicePropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.choiceProperty`.
	 * @param ctx the parse tree
	 */
	exitChoiceProperty?: (ctx: ChoicePropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.integerProperty`.
	 * @param ctx the parse tree
	 */
	enterIntegerProperty?: (ctx: IntegerPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.integerProperty`.
	 * @param ctx the parse tree
	 */
	exitIntegerProperty?: (ctx: IntegerPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.percentProperty`.
	 * @param ctx the parse tree
	 */
	enterPercentProperty?: (ctx: PercentPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.percentProperty`.
	 * @param ctx the parse tree
	 */
	exitPercentProperty?: (ctx: PercentPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.associationProperty`.
	 * @param ctx the parse tree
	 */
	enterAssociationProperty?: (ctx: AssociationPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.associationProperty`.
	 * @param ctx the parse tree
	 */
	exitAssociationProperty?: (ctx: AssociationPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.domainEntityProperty`.
	 * @param ctx the parse tree
	 */
	enterDomainEntityProperty?: (ctx: DomainEntityPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.domainEntityProperty`.
	 * @param ctx the parse tree
	 */
	exitDomainEntityProperty?: (ctx: DomainEntityPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedDecimalProperty`.
	 * @param ctx the parse tree
	 */
	enterSharedDecimalProperty?: (ctx: SharedDecimalPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedDecimalProperty`.
	 * @param ctx the parse tree
	 */
	exitSharedDecimalProperty?: (ctx: SharedDecimalPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedIntegerProperty`.
	 * @param ctx the parse tree
	 */
	enterSharedIntegerProperty?: (ctx: SharedIntegerPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedIntegerProperty`.
	 * @param ctx the parse tree
	 */
	exitSharedIntegerProperty?: (ctx: SharedIntegerPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedShortProperty`.
	 * @param ctx the parse tree
	 */
	enterSharedShortProperty?: (ctx: SharedShortPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedShortProperty`.
	 * @param ctx the parse tree
	 */
	exitSharedShortProperty?: (ctx: SharedShortPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedStringProperty`.
	 * @param ctx the parse tree
	 */
	enterSharedStringProperty?: (ctx: SharedStringPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedStringProperty`.
	 * @param ctx the parse tree
	 */
	exitSharedStringProperty?: (ctx: SharedStringPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.shortProperty`.
	 * @param ctx the parse tree
	 */
	enterShortProperty?: (ctx: ShortPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.shortProperty`.
	 * @param ctx the parse tree
	 */
	exitShortProperty?: (ctx: ShortPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.stringProperty`.
	 * @param ctx the parse tree
	 */
	enterStringProperty?: (ctx: StringPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.stringProperty`.
	 * @param ctx the parse tree
	 */
	exitStringProperty?: (ctx: StringPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.timeProperty`.
	 * @param ctx the parse tree
	 */
	enterTimeProperty?: (ctx: TimePropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.timeProperty`.
	 * @param ctx the parse tree
	 */
	exitTimeProperty?: (ctx: TimePropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.yearProperty`.
	 * @param ctx the parse tree
	 */
	enterYearProperty?: (ctx: YearPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.yearProperty`.
	 * @param ctx the parse tree
	 */
	exitYearProperty?: (ctx: YearPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.isWeakReference`.
	 * @param ctx the parse tree
	 */
	enterIsWeakReference?: (ctx: IsWeakReferenceContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.isWeakReference`.
	 * @param ctx the parse tree
	 */
	exitIsWeakReference?: (ctx: IsWeakReferenceContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.potentiallyLogical`.
	 * @param ctx the parse tree
	 */
	enterPotentiallyLogical?: (ctx: PotentiallyLogicalContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.potentiallyLogical`.
	 * @param ctx the parse tree
	 */
	exitPotentiallyLogical?: (ctx: PotentiallyLogicalContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.mergeDirective`.
	 * @param ctx the parse tree
	 */
	enterMergeDirective?: (ctx: MergeDirectiveContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.mergeDirective`.
	 * @param ctx the parse tree
	 */
	exitMergeDirective?: (ctx: MergeDirectiveContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sourcePropertyPath`.
	 * @param ctx the parse tree
	 */
	enterSourcePropertyPath?: (ctx: SourcePropertyPathContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sourcePropertyPath`.
	 * @param ctx the parse tree
	 */
	exitSourcePropertyPath?: (ctx: SourcePropertyPathContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.targetPropertyPath`.
	 * @param ctx the parse tree
	 */
	enterTargetPropertyPath?: (ctx: TargetPropertyPathContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.targetPropertyPath`.
	 * @param ctx the parse tree
	 */
	exitTargetPropertyPath?: (ctx: TargetPropertyPathContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.propertyPath`.
	 * @param ctx the parse tree
	 */
	enterPropertyPath?: (ctx: PropertyPathContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.propertyPath`.
	 * @param ctx the parse tree
	 */
	exitPropertyPath?: (ctx: PropertyPathContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.signed_int`.
	 * @param ctx the parse tree
	 */
	enterSigned_int?: (ctx: Signed_intContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.signed_int`.
	 * @param ctx the parse tree
	 */
	exitSigned_int?: (ctx: Signed_intContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.unaryOperator`.
	 * @param ctx the parse tree
	 */
	enterUnaryOperator?: (ctx: UnaryOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.unaryOperator`.
	 * @param ctx the parse tree
	 */
	exitUnaryOperator?: (ctx: UnaryOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.abstractEntityName`.
	 * @param ctx the parse tree
	 */
	enterAbstractEntityName?: (ctx: AbstractEntityNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.abstractEntityName`.
	 * @param ctx the parse tree
	 */
	exitAbstractEntityName?: (ctx: AbstractEntityNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.associationName`.
	 * @param ctx the parse tree
	 */
	enterAssociationName?: (ctx: AssociationNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.associationName`.
	 * @param ctx the parse tree
	 */
	exitAssociationName?: (ctx: AssociationNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.baseKeyName`.
	 * @param ctx the parse tree
	 */
	enterBaseKeyName?: (ctx: BaseKeyNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.baseKeyName`.
	 * @param ctx the parse tree
	 */
	exitBaseKeyName?: (ctx: BaseKeyNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.baseName`.
	 * @param ctx the parse tree
	 */
	enterBaseName?: (ctx: BaseNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.baseName`.
	 * @param ctx the parse tree
	 */
	exitBaseName?: (ctx: BaseNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.baseNamespace`.
	 * @param ctx the parse tree
	 */
	enterBaseNamespace?: (ctx: BaseNamespaceContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.baseNamespace`.
	 * @param ctx the parse tree
	 */
	exitBaseNamespace?: (ctx: BaseNamespaceContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.choiceName`.
	 * @param ctx the parse tree
	 */
	enterChoiceName?: (ctx: ChoiceNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.choiceName`.
	 * @param ctx the parse tree
	 */
	exitChoiceName?: (ctx: ChoiceNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedDecimalName`.
	 * @param ctx the parse tree
	 */
	enterSharedDecimalName?: (ctx: SharedDecimalNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedDecimalName`.
	 * @param ctx the parse tree
	 */
	exitSharedDecimalName?: (ctx: SharedDecimalNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedIntegerName`.
	 * @param ctx the parse tree
	 */
	enterSharedIntegerName?: (ctx: SharedIntegerNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedIntegerName`.
	 * @param ctx the parse tree
	 */
	exitSharedIntegerName?: (ctx: SharedIntegerNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.commonName`.
	 * @param ctx the parse tree
	 */
	enterCommonName?: (ctx: CommonNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.commonName`.
	 * @param ctx the parse tree
	 */
	exitCommonName?: (ctx: CommonNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedShortName`.
	 * @param ctx the parse tree
	 */
	enterSharedShortName?: (ctx: SharedShortNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedShortName`.
	 * @param ctx the parse tree
	 */
	exitSharedShortName?: (ctx: SharedShortNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedStringName`.
	 * @param ctx the parse tree
	 */
	enterSharedStringName?: (ctx: SharedStringNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedStringName`.
	 * @param ctx the parse tree
	 */
	exitSharedStringName?: (ctx: SharedStringNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.descriptorName`.
	 * @param ctx the parse tree
	 */
	enterDescriptorName?: (ctx: DescriptorNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.descriptorName`.
	 * @param ctx the parse tree
	 */
	exitDescriptorName?: (ctx: DescriptorNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.domainName`.
	 * @param ctx the parse tree
	 */
	enterDomainName?: (ctx: DomainNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.domainName`.
	 * @param ctx the parse tree
	 */
	exitDomainName?: (ctx: DomainNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.entityName`.
	 * @param ctx the parse tree
	 */
	enterEntityName?: (ctx: EntityNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.entityName`.
	 * @param ctx the parse tree
	 */
	exitEntityName?: (ctx: EntityNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.enumerationName`.
	 * @param ctx the parse tree
	 */
	enterEnumerationName?: (ctx: EnumerationNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.enumerationName`.
	 * @param ctx the parse tree
	 */
	exitEnumerationName?: (ctx: EnumerationNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.extendeeName`.
	 * @param ctx the parse tree
	 */
	enterExtendeeName?: (ctx: ExtendeeNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.extendeeName`.
	 * @param ctx the parse tree
	 */
	exitExtendeeName?: (ctx: ExtendeeNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.extendeeNamespace`.
	 * @param ctx the parse tree
	 */
	enterExtendeeNamespace?: (ctx: ExtendeeNamespaceContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.extendeeNamespace`.
	 * @param ctx the parse tree
	 */
	exitExtendeeNamespace?: (ctx: ExtendeeNamespaceContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.inlineCommonName`.
	 * @param ctx the parse tree
	 */
	enterInlineCommonName?: (ctx: InlineCommonNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.inlineCommonName`.
	 * @param ctx the parse tree
	 */
	exitInlineCommonName?: (ctx: InlineCommonNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.interchangeName`.
	 * @param ctx the parse tree
	 */
	enterInterchangeName?: (ctx: InterchangeNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.interchangeName`.
	 * @param ctx the parse tree
	 */
	exitInterchangeName?: (ctx: InterchangeNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.localBaseName`.
	 * @param ctx the parse tree
	 */
	enterLocalBaseName?: (ctx: LocalBaseNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.localBaseName`.
	 * @param ctx the parse tree
	 */
	exitLocalBaseName?: (ctx: LocalBaseNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.localDomainItemName`.
	 * @param ctx the parse tree
	 */
	enterLocalDomainItemName?: (ctx: LocalDomainItemNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.localDomainItemName`.
	 * @param ctx the parse tree
	 */
	exitLocalDomainItemName?: (ctx: LocalDomainItemNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.localExtendeeName`.
	 * @param ctx the parse tree
	 */
	enterLocalExtendeeName?: (ctx: LocalExtendeeNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.localExtendeeName`.
	 * @param ctx the parse tree
	 */
	exitLocalExtendeeName?: (ctx: LocalExtendeeNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.localInterchangeItemName`.
	 * @param ctx the parse tree
	 */
	enterLocalInterchangeItemName?: (ctx: LocalInterchangeItemNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.localInterchangeItemName`.
	 * @param ctx the parse tree
	 */
	exitLocalInterchangeItemName?: (ctx: LocalInterchangeItemNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.localPropertyName`.
	 * @param ctx the parse tree
	 */
	enterLocalPropertyName?: (ctx: LocalPropertyNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.localPropertyName`.
	 * @param ctx the parse tree
	 */
	exitLocalPropertyName?: (ctx: LocalPropertyNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.localPropertyType`.
	 * @param ctx the parse tree
	 */
	enterLocalPropertyType?: (ctx: LocalPropertyTypeContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.localPropertyType`.
	 * @param ctx the parse tree
	 */
	exitLocalPropertyType?: (ctx: LocalPropertyTypeContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.parentDomainName`.
	 * @param ctx the parse tree
	 */
	enterParentDomainName?: (ctx: ParentDomainNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.parentDomainName`.
	 * @param ctx the parse tree
	 */
	exitParentDomainName?: (ctx: ParentDomainNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.propertyName`.
	 * @param ctx the parse tree
	 */
	enterPropertyName?: (ctx: PropertyNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.propertyName`.
	 * @param ctx the parse tree
	 */
	exitPropertyName?: (ctx: PropertyNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.propertyNamespace`.
	 * @param ctx the parse tree
	 */
	enterPropertyNamespace?: (ctx: PropertyNamespaceContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.propertyNamespace`.
	 * @param ctx the parse tree
	 */
	exitPropertyNamespace?: (ctx: PropertyNamespaceContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.roleNameName`.
	 * @param ctx the parse tree
	 */
	enterRoleNameName?: (ctx: RoleNameNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.roleNameName`.
	 * @param ctx the parse tree
	 */
	exitRoleNameName?: (ctx: RoleNameNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedPropertyName`.
	 * @param ctx the parse tree
	 */
	enterSharedPropertyName?: (ctx: SharedPropertyNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedPropertyName`.
	 * @param ctx the parse tree
	 */
	exitSharedPropertyName?: (ctx: SharedPropertyNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.sharedPropertyType`.
	 * @param ctx the parse tree
	 */
	enterSharedPropertyType?: (ctx: SharedPropertyTypeContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.sharedPropertyType`.
	 * @param ctx the parse tree
	 */
	exitSharedPropertyType?: (ctx: SharedPropertyTypeContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.shortenToName`.
	 * @param ctx the parse tree
	 */
	enterShortenToName?: (ctx: ShortenToNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.shortenToName`.
	 * @param ctx the parse tree
	 */
	exitShortenToName?: (ctx: ShortenToNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.simplePropertyName`.
	 * @param ctx the parse tree
	 */
	enterSimplePropertyName?: (ctx: SimplePropertyNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.simplePropertyName`.
	 * @param ctx the parse tree
	 */
	exitSimplePropertyName?: (ctx: SimplePropertyNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.subdomainName`.
	 * @param ctx the parse tree
	 */
	enterSubdomainName?: (ctx: SubdomainNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.subdomainName`.
	 * @param ctx the parse tree
	 */
	exitSubdomainName?: (ctx: SubdomainNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.namespaceName`.
	 * @param ctx the parse tree
	 */
	enterNamespaceName?: (ctx: NamespaceNameContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.namespaceName`.
	 * @param ctx the parse tree
	 */
	exitNamespaceName?: (ctx: NamespaceNameContext) => void;
	/**
	 * Enter a parse tree produced by `MetaEdGrammar.metaEdId`.
	 * @param ctx the parse tree
	 */
	enterMetaEdId?: (ctx: MetaEdIdContext) => void;
	/**
	 * Exit a parse tree produced by `MetaEdGrammar.metaEdId`.
	 * @param ctx the parse tree
	 */
	exitMetaEdId?: (ctx: MetaEdIdContext) => void;
}

