/// <reference path="../../../src/grammar/gen/MetaEdGrammar.d.ts" />
/// <reference path="../../../src/grammar/gen/MetaEdGrammarListener.d.ts" />

import {MetaEdGrammarListener} from '../../../src/grammar/gen/MetaEdGrammarListener';
import List from 'typescript-dotnet-commonjs/System/Collections/List'
import {IValidationRule} from "./IValidationRule";
import {IMetaEdContext} from "../tasks/MetaEdContext";
import {IMetaEdFileIndex} from "../../grammar/IMetaEdFileIndex";
import {ISymbolTable} from "./SymbolTable";
import ValidationMessage from "../../common/ValidationMessage";
import {ValidationLevel} from "./ValidationLevel";

import ParserRuleContext = MetaEdGrammar.ParserRuleContext;
import {IListenerWithContext} from "./IListenerWithContext";
import {IRuleProvider} from "./RuleProvider";

export class ValidatorListener extends MetaEdGrammarListener implements IListenerWithContext {
    private symbolTable: ISymbolTable;
    private metaEdFileIndex: IMetaEdFileIndex;
    private warningMessageCollection: List<ValidationMessage>;
    private errorMessageCollection: List<ValidationMessage>;
    private ruleProvider: IRuleProvider;

    constructor(ruleProvider: IRuleProvider) {
        super();
        this.ruleProvider = ruleProvider;
    }

    public withContext(context: IMetaEdContext): void {
        this.metaEdFileIndex = context.metaEdFileIndex;
        this.warningMessageCollection = context.warningMessageCollection;
        this.errorMessageCollection = context.errorMessageCollection;
        this.symbolTable = context.symbolTable;
    }

     private validateContext<TContext extends ParserRuleContext>(context: TContext) {
         const validationRules = this.ruleProvider.getAll(this.symbolTable);
         validationRules.filter(x => x.level() == ValidationLevel.Error && !x.isValid(context))
             .forEach(y => this.errorMessageCollection.add(this.buildValidationMessage(y, context)));

         validationRules.filter(x => x.level() == ValidationLevel.Warning && !x.isValid(context))
             .forEach(y => this.warningMessageCollection.add(this.buildValidationMessage(y, context)));
    }

    private buildValidationMessage<TContext extends ParserRuleContext>(validationRule: IValidationRule<TContext>, context: TContext) : ValidationMessage {
        const metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(context.start.line);
        return <ValidationMessage> {
            message: validationRule.getFailureMessage(context),
            characterPosition: context.start.column,
            concatenatedLineNumber: context.start.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
    }
        public enterAbstractEntity(context: MetaEdGrammar.AbstractEntityContext): void {
            this.validateContext(context);
        }
        public enterAbstractEntityName(context: MetaEdGrammar.AbstractEntityNameContext): void {
            this.validateContext(context);
        }
        public enterAssociation(context: MetaEdGrammar.AssociationContext): void {
            this.validateContext(context);
        }
        public enterAssociationExtension(context: MetaEdGrammar.AssociationExtensionContext): void {
            this.validateContext(context);
        }
        public enterAssociationName(context: MetaEdGrammar.AssociationNameContext): void {
            this.validateContext(context);
        }
        public enterAssociationSubclass(context: MetaEdGrammar.AssociationSubclassContext): void {
            this.validateContext(context);
        }
        public enterBaseKeyName(context: MetaEdGrammar.BaseKeyNameContext): void {
            this.validateContext(context);
        }
        public enterBaseName(context: MetaEdGrammar.BaseNameContext): void {
            this.validateContext(context);
        }
        public enterBooleanProperty(context: MetaEdGrammar.BooleanPropertyContext): void {
            this.validateContext(context);
        }
        public enterCascadeUpdate(context: MetaEdGrammar.CascadeUpdateContext): void {
            this.validateContext(context);
        }
        public enterChoiceName(context: MetaEdGrammar.ChoiceNameContext): void {
            this.validateContext(context);
        }
        public enterChoiceType(context: MetaEdGrammar.ChoiceTypeContext): void {
            this.validateContext(context);
        }
        public enterCollection(context: MetaEdGrammar.CollectionContext): void {
            this.validateContext(context);
        }
        public enterCommonDecimalName(context: MetaEdGrammar.CommonDecimalNameContext): void {
            this.validateContext(context);
        }
        public enterCommonDecimal(context: MetaEdGrammar.CommonDecimalContext): void {
            this.validateContext(context);
        }
        public enterCommonIntegerName(context: MetaEdGrammar.CommonIntegerNameContext): void {
            this.validateContext(context);
        }
        public enterCommonInteger(context: MetaEdGrammar.CommonIntegerContext): void {
            this.validateContext(context);
        }
        public enterCommonShortName(context: MetaEdGrammar.CommonShortNameContext): void {
            this.validateContext(context);
        }
        public enterCommonShort(context: MetaEdGrammar.CommonShortContext): void {
            this.validateContext(context);
        }
        public enterCommonStringName(context: MetaEdGrammar.CommonStringNameContext): void {
            this.validateContext(context);
        }
        public enterCommonString(context: MetaEdGrammar.CommonStringContext): void {
            this.validateContext(context);
        }
        public enterCommonName(context: MetaEdGrammar.CommonNameContext): void {
            this.validateContext(context);
        }
        public enterCommonType(context: MetaEdGrammar.CommonTypeContext): void {
            this.validateContext(context);
        }
        public enterCommonTypeExtension(context: MetaEdGrammar.CommonTypeExtensionContext): void {
            this.validateContext(context);
        }
        public enterCurrencyProperty(context: MetaEdGrammar.CurrencyPropertyContext): void {
            this.validateContext(context);
        }
        public enterDateProperty(context: MetaEdGrammar.DatePropertyContext): void {
            this.validateContext(context);
        }
        public enterDecimalPlaces(context: MetaEdGrammar.DecimalPlacesContext): void {
            this.validateContext(context);
        }
        public enterDecimalProperty(context: MetaEdGrammar.DecimalPropertyContext): void {
            this.validateContext(context);
        }
        public enterDecimalValue(context: MetaEdGrammar.DecimalValueContext): void {
            this.validateContext(context);
        }
        public enterDescriptor(context: MetaEdGrammar.DescriptorContext): void {
            this.validateContext(context);
        }
        public enterDescriptorName(context: MetaEdGrammar.DescriptorNameContext): void {
            this.validateContext(context);
        }
        public enterDescriptorProperty(context: MetaEdGrammar.DescriptorPropertyContext): void {
            this.validateContext(context);
        }
        public enterDocumentation(context: MetaEdGrammar.DocumentationContext): void {
            this.validateContext(context);
        }
        public enterFooterDocumentation(context: MetaEdGrammar.FooterDocumentationContext): void {
            this.validateContext(context);
        }
        public enterExtendedDocumentation(context: MetaEdGrammar.ExtendedDocumentationContext): void {
            this.validateContext(context);
        }
        public enterUseCaseDocumentation(context: MetaEdGrammar.UseCaseDocumentationContext): void {
            this.validateContext(context);
        }
        public enterDocumentationLine(context: MetaEdGrammar.DocumentationLineContext): void {
            this.validateContext(context);
        }
        public enterDomain(context: MetaEdGrammar.DomainContext): void {
            this.validateContext(context);
        }
        public enterDomainItem(context: MetaEdGrammar.DomainItemContext): void {
            this.validateContext(context);
        }
        public enterDomainName(context: MetaEdGrammar.DomainNameContext): void {
            this.validateContext(context);
        }
        public enterDomainEntity(context: MetaEdGrammar.DomainEntityContext): void {
            this.validateContext(context);
        }
        public enterDomainEntityExtension(context: MetaEdGrammar.DomainEntityExtensionContext): void {
            this.validateContext(context);
        }
        public enterDomainEntitySubclass(context: MetaEdGrammar.DomainEntitySubclassContext): void {
            this.validateContext(context);
        }
        public enterDurationProperty(context: MetaEdGrammar.DurationPropertyContext): void {
            this.validateContext(context);
        }
        public enterEntityConfiguration(context: MetaEdGrammar.EntityConfigurationContext): void {
            this.validateContext(context);
        }
        public enterEntityName(context: MetaEdGrammar.EntityNameContext): void {
            this.validateContext(context);
        }
        public enterEnumeration(context: MetaEdGrammar.EnumerationContext): void {
            this.validateContext(context);
        }
        public enterEnumerationName(context: MetaEdGrammar.EnumerationNameContext): void {
            this.validateContext(context);
        }
        public enterEnumerationProperty(context: MetaEdGrammar.EnumerationPropertyContext): void {
            this.validateContext(context);
        }
        public enterExtendeeName(context: MetaEdGrammar.ExtendeeNameContext): void {
            this.validateContext(context);
        }
        public enterFirstDomainEntity(context: MetaEdGrammar.FirstDomainEntityContext): void {
            this.validateContext(context);
        }
        public enterIncludeProperty(context: MetaEdGrammar.IncludePropertyContext): void {
            this.validateContext(context);
        }
        public enterIncludeExtensionOverride(context: MetaEdGrammar.IncludeExtensionOverrideContext): void {

        }
        public enterInlineCommonName(context: MetaEdGrammar.InlineCommonNameContext): void {
            this.validateContext(context);
        }
        public enterInlineCommonType(context: MetaEdGrammar.InlineCommonTypeContext): void {
            this.validateContext(context);
        }
        public enterSigned_int(context: MetaEdGrammar.Signed_intContext): void {
            this.validateContext(context);
        }
        public enterIntegerProperty(context: MetaEdGrammar.IntegerPropertyContext): void {
            this.validateContext(context);
        }
        public enterInterchange(context: MetaEdGrammar.InterchangeContext): void {
            this.validateContext(context);
        }
        public enterInterchangeComponent(context: MetaEdGrammar.InterchangeComponentContext): void {
            this.validateContext(context);
        }
        public enterInterchangeElement(context: MetaEdGrammar.InterchangeElementContext): void {
            this.validateContext(context);
        }
        public enterInterchangeExtension(context: MetaEdGrammar.InterchangeExtensionContext): void {
            this.validateContext(context);
        }
        public enterInterchangeExtensionComponent(context: MetaEdGrammar.InterchangeExtensionComponentContext): void {
            this.validateContext(context);
        }
        public enterInterchangeIdentityTemplate(context: MetaEdGrammar.InterchangeIdentityTemplateContext): void {
            this.validateContext(context);
        }
        public enterInterchangeName(context: MetaEdGrammar.InterchangeNameContext): void {
            this.validateContext(context);
        }
        public enterEnumerationItem(context: MetaEdGrammar.EnumerationItemContext): void {
            this.validateContext(context);
        }
        public enterMaxLength(context: MetaEdGrammar.MaxLengthContext): void {
            this.validateContext(context);
        }
        public enterMaxValue(context: MetaEdGrammar.MaxValueContext): void {
            this.validateContext(context);
        }
        public enterMaxValueDecimal(context: MetaEdGrammar.MaxValueDecimalContext): void {
            this.validateContext(context);
        }
        public enterIsWeakReference(context: MetaEdGrammar.IsWeakReferenceContext): void {
            this.validateContext(context);
        }
        public enterMergePartOfReference(context: MetaEdGrammar.MergePartOfReferenceContext): void {
            this.validateContext(context);
        }
        public enterMergePropertyPath(context: MetaEdGrammar.MergePropertyPathContext): void {
            this.validateContext(context);
        }
        public enterMetaEd(context: MetaEdGrammar.MetaEdContext): void {
            this.validateContext(context);
        }
        public enterMinLength(context: MetaEdGrammar.MinLengthContext): void {
            this.validateContext(context);
        }
        public enterMinValue(context: MetaEdGrammar.MinValueContext): void {
            this.validateContext(context);
        }
        public enterMinValueDecimal(context: MetaEdGrammar.MinValueDecimalContext): void {
            this.validateContext(context);
        }
        public enterNamespace(context: MetaEdGrammar.NamespaceContext): void {
            this.validateContext(context);
        }
        public enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext): void {
            this.validateContext(context);
        }
        public enterNamespaceType(context: MetaEdGrammar.NamespaceTypeContext): void {
            this.validateContext(context);
        }
        public enterNamespaceProjectExtension(context: MetaEdGrammar.NamespaceProjectExtensionContext): void {
            this.validateContext(context);
        }
        public enterOptional(context: MetaEdGrammar.OptionalContext): void {
            this.validateContext(context);
        }
        public enterOptionalCollection(context: MetaEdGrammar.OptionalCollectionContext): void {
            this.validateContext(context);
        }
        public enterOptionalMapType(context: MetaEdGrammar.OptionalMapTypeContext): void {
            this.validateContext(context);
        }
        public enterPercentProperty(context: MetaEdGrammar.PercentPropertyContext): void {
            this.validateContext(context);
        }
        public enterIdentity(context: MetaEdGrammar.IdentityContext): void {
            this.validateContext(context);
        }
        public enterIdentityRename(context: MetaEdGrammar.IdentityRenameContext): void {
            this.validateContext(context);
        }
        public enterMetaEdId(context: MetaEdGrammar.MetaEdIdContext): void {
            this.validateContext(context);
        }
        public enterProperty(context: MetaEdGrammar.PropertyContext): void {
            this.validateContext(context);
        }
        public enterPropertyAnnotation(context: MetaEdGrammar.PropertyAnnotationContext): void {
            this.validateContext(context);
        }
        public enterPropertyComponents(context: MetaEdGrammar.PropertyComponentsContext): void {
            this.validateContext(context);
        }
        public enterPropertyName(context: MetaEdGrammar.PropertyNameContext): void {
            this.validateContext(context);
        }
        public enterPropertyPath(context: MetaEdGrammar.PropertyPathContext): void {
            this.validateContext(context);
        }
        public enterReferenceProperty(context: MetaEdGrammar.ReferencePropertyContext): void {
            this.validateContext(context);
        }
        public enterRequired(context: MetaEdGrammar.RequiredContext): void {
            this.validateContext(context);
        }
        public enterRequiredCollection(context: MetaEdGrammar.RequiredCollectionContext): void {
            this.validateContext(context);
        }
        public enterRequiredMapType(context: MetaEdGrammar.RequiredMapTypeContext): void {
            this.validateContext(context);
        }
        public enterSecondDomainEntity(context: MetaEdGrammar.SecondDomainEntityContext): void {
            this.validateContext(context);
        }
        public enterShortDescription(context: MetaEdGrammar.ShortDescriptionContext): void {
            this.validateContext(context);
        }
        public enterSharedDecimalProperty(context: MetaEdGrammar.SharedDecimalPropertyContext): void {
            this.validateContext(context);
        }
        public enterSharedIntegerProperty(context: MetaEdGrammar.SharedIntegerPropertyContext): void {
            this.validateContext(context);
        }
        public enterSharedShortProperty(context: MetaEdGrammar.SharedShortPropertyContext): void {
            this.validateContext(context);
        }
        public enterSharedStringProperty(context: MetaEdGrammar.SharedStringPropertyContext): void {
            this.validateContext(context);
        }
        public enterSharedPropertyType(context: MetaEdGrammar.SharedPropertyTypeContext): void {
            this.validateContext(context);
        }
        public enterShortenToName(context: MetaEdGrammar.ShortenToNameContext): void {
            this.validateContext(context);
        }
        public enterShortProperty(context: MetaEdGrammar.ShortPropertyContext): void {
            this.validateContext(context);
        }
        public enterStringProperty(context: MetaEdGrammar.StringPropertyContext): void {
            this.validateContext(context);
        }
        public enterSubdomain(context: MetaEdGrammar.SubdomainContext): void {
            this.validateContext(context);
        }
        public enterParentDomainName(context: MetaEdGrammar.ParentDomainNameContext): void {
            this.validateContext(context);
        }
        public enterSubdomainName(context: MetaEdGrammar.SubdomainNameContext): void {
            this.validateContext(context);
        }
        public enterSubdomainPosition(context: MetaEdGrammar.SubdomainPositionContext): void {
            this.validateContext(context);
        }
        public enterTargetPropertyPath(context: MetaEdGrammar.TargetPropertyPathContext): void {
            this.validateContext(context);
        }
        public enterTimeProperty(context: MetaEdGrammar.TimePropertyContext): void {
            this.validateContext(context);
        }
        public enterTopLevelEntity(context: MetaEdGrammar.TopLevelEntityContext): void {
            this.validateContext(context);
        }
        public enterTotalDigits(context: MetaEdGrammar.TotalDigitsContext): void {
            this.validateContext(context);
        }
        public enterUnaryOperator(context: MetaEdGrammar.UnaryOperatorContext): void {
            this.validateContext(context);
        }
        public enterIsQueryableField(context: MetaEdGrammar.IsQueryableFieldContext): void {
            this.validateContext(context);
        }
        public enterIsQueryableOnly(context: MetaEdGrammar.IsQueryableOnlyContext): void {
            this.validateContext(context);
        }
        public enterWithContext(context: MetaEdGrammar.WithContextContext): void {
            this.validateContext(context);
        }
        public enterWithContextName(context: MetaEdGrammar.WithContextNameContext): void {
            this.validateContext(context);
        }
        public enterWithMapType(context: MetaEdGrammar.WithMapTypeContext): void {
            this.validateContext(context);
        }
        public enterYearProperty(context: MetaEdGrammar.YearPropertyContext): void {
            this.validateContext(context);
        }
        public exitAbstractEntity(context: MetaEdGrammar.AbstractEntityContext): void {

        }
        public exitAbstractEntityName(context: MetaEdGrammar.AbstractEntityNameContext): void {

        }
        public exitAssociation(context: MetaEdGrammar.AssociationContext): void {

        }
        public exitAssociationExtension(context: MetaEdGrammar.AssociationExtensionContext): void {

        }
        public exitAssociationName(context: MetaEdGrammar.AssociationNameContext): void {

        }
        public exitAssociationSubclass(context: MetaEdGrammar.AssociationSubclassContext): void {

        }
        public exitBaseKeyName(context: MetaEdGrammar.BaseKeyNameContext): void {

        }
        public exitBaseName(context: MetaEdGrammar.BaseNameContext): void {

        }
        public exitBooleanProperty(context: MetaEdGrammar.BooleanPropertyContext): void {

        }
        public exitCascadeUpdate(context: MetaEdGrammar.CascadeUpdateContext): void {

        }
        public exitChoiceName(context: MetaEdGrammar.ChoiceNameContext): void {

        }
        public exitChoiceType(context: MetaEdGrammar.ChoiceTypeContext): void {

        }
        public exitCollection(context: MetaEdGrammar.CollectionContext): void {

        }
        public exitCommonDecimalName(context: MetaEdGrammar.CommonDecimalNameContext): void {

        }
        public exitCommonDecimal(context: MetaEdGrammar.CommonDecimalContext): void {

        }
        public exitCommonIntegerName(context: MetaEdGrammar.CommonIntegerNameContext): void {

        }
        public exitCommonInteger(context: MetaEdGrammar.CommonIntegerContext): void {

        }
        public exitCommonShortName(context: MetaEdGrammar.CommonShortNameContext): void {

        }
        public exitCommonShort(context: MetaEdGrammar.CommonShortContext): void {

        }
        public exitCommonStringName(context: MetaEdGrammar.CommonStringNameContext): void {

        }
        public exitCommonString(context: MetaEdGrammar.CommonStringContext): void {

        }
        public exitCommonName(context: MetaEdGrammar.CommonNameContext): void {

        }
        public exitCommonType(context: MetaEdGrammar.CommonTypeContext): void {

        }
        public exitCommonTypeExtension(context: MetaEdGrammar.CommonTypeExtensionContext): void {

        }
        public exitCurrencyProperty(context: MetaEdGrammar.CurrencyPropertyContext): void {

        }
        public exitDateProperty(context: MetaEdGrammar.DatePropertyContext): void {

        }
        public exitDecimalPlaces(context: MetaEdGrammar.DecimalPlacesContext): void {

        }
        public exitDecimalProperty(context: MetaEdGrammar.DecimalPropertyContext): void {

        }
        public exitDecimalValue(context: MetaEdGrammar.DecimalValueContext): void {

        }
        public exitDescriptor(context: MetaEdGrammar.DescriptorContext): void {

        }
        public exitDescriptorName(context: MetaEdGrammar.DescriptorNameContext): void {

        }
        public exitDescriptorProperty(context: MetaEdGrammar.DescriptorPropertyContext): void {

        }
        public exitDocumentation(context: MetaEdGrammar.DocumentationContext): void {

        }
        public exitFooterDocumentation(context: MetaEdGrammar.FooterDocumentationContext): void {

        }
        public exitExtendedDocumentation(context: MetaEdGrammar.ExtendedDocumentationContext): void {

        }
        public exitUseCaseDocumentation(context: MetaEdGrammar.UseCaseDocumentationContext): void {

        }
        public exitDocumentationLine(context: MetaEdGrammar.DocumentationLineContext): void {

        }
        public exitDomain(context: MetaEdGrammar.DomainContext): void {

        }
        public exitDomainItem(context: MetaEdGrammar.DomainItemContext): void {

        }
        public exitDomainName(context: MetaEdGrammar.DomainNameContext): void {

        }
        public exitDomainEntity(context: MetaEdGrammar.DomainEntityContext): void {

        }
        public exitDomainEntityExtension(context: MetaEdGrammar.DomainEntityExtensionContext): void {

        }
        public exitDomainEntitySubclass(context: MetaEdGrammar.DomainEntitySubclassContext): void {

        }
        public exitDurationProperty(context: MetaEdGrammar.DurationPropertyContext): void {

        }
        public exitEntityConfiguration(context: MetaEdGrammar.EntityConfigurationContext): void {

        }
        public exitEntityName(context: MetaEdGrammar.EntityNameContext): void {

        }
        public exitEnumeration(context: MetaEdGrammar.EnumerationContext): void {

        }
        public exitEnumerationName(context: MetaEdGrammar.EnumerationNameContext): void {

        }
        public exitEnumerationProperty(context: MetaEdGrammar.EnumerationPropertyContext): void {

        }
        public exitExtendeeName(context: MetaEdGrammar.ExtendeeNameContext): void {

        }
        public exitFirstDomainEntity(context: MetaEdGrammar.FirstDomainEntityContext): void {

        }
        public exitIncludeProperty(context: MetaEdGrammar.IncludePropertyContext): void {

        }
        public exitIncludeExtensionOverride(context: MetaEdGrammar.IncludeExtensionOverrideContext): void {

        }
        public exitInlineCommonName(context: MetaEdGrammar.InlineCommonNameContext): void {

        }
        public exitInlineCommonType(context: MetaEdGrammar.InlineCommonTypeContext): void {

        }
        public exitSigned_int(context: MetaEdGrammar.Signed_intContext): void {

        }
        public exitIntegerProperty(context: MetaEdGrammar.IntegerPropertyContext): void {

        }
        public exitInterchange(context: MetaEdGrammar.InterchangeContext): void {

        }
        public exitInterchangeComponent(context: MetaEdGrammar.InterchangeComponentContext): void {

        }
        public exitInterchangeElement(context: MetaEdGrammar.InterchangeElementContext): void {

        }
        public exitInterchangeExtension(context: MetaEdGrammar.InterchangeExtensionContext): void {

        }
        public exitInterchangeExtensionComponent(context: MetaEdGrammar.InterchangeExtensionComponentContext): void {

        }
        public exitInterchangeIdentityTemplate(context: MetaEdGrammar.InterchangeIdentityTemplateContext): void {

        }
        public exitInterchangeName(context: MetaEdGrammar.InterchangeNameContext): void {

        }
        public exitEnumerationItem(context: MetaEdGrammar.EnumerationItemContext): void {

        }
        public exitMaxLength(context: MetaEdGrammar.MaxLengthContext): void {

        }
        public exitMaxValue(context: MetaEdGrammar.MaxValueContext): void {

        }
        public exitMaxValueDecimal(context: MetaEdGrammar.MaxValueDecimalContext): void {

        }
        public exitIsWeakReference(context: MetaEdGrammar.IsWeakReferenceContext): void {

        }
        public exitMergePartOfReference(context: MetaEdGrammar.MergePartOfReferenceContext): void {

        }
        public exitMergePropertyPath(context: MetaEdGrammar.MergePropertyPathContext): void {

        }
        public exitMetaEd(context: MetaEdGrammar.MetaEdContext): void {

        }
        public exitMinLength(context: MetaEdGrammar.MinLengthContext): void {

        }
        public exitMinValue(context: MetaEdGrammar.MinValueContext): void {

        }
        public exitMinValueDecimal(context: MetaEdGrammar.MinValueDecimalContext): void {

        }
        public exitNamespace(context: MetaEdGrammar.NamespaceContext): void {

        }
        public exitNamespaceName(context: MetaEdGrammar.NamespaceNameContext): void {

        }
        public exitNamespaceType(context: MetaEdGrammar.NamespaceTypeContext): void {

        }
        public exitNamespaceProjectExtension(context: MetaEdGrammar.NamespaceProjectExtensionContext): void {

        }
        public exitOptional(context: MetaEdGrammar.OptionalContext): void {

        }
        public exitOptionalCollection(context: MetaEdGrammar.OptionalCollectionContext): void {

        }
        public exitOptionalMapType(context: MetaEdGrammar.OptionalMapTypeContext): void {

        }
        public exitPercentProperty(context: MetaEdGrammar.PercentPropertyContext): void {

        }
        public exitIdentity(context: MetaEdGrammar.IdentityContext): void {

        }
        public exitIdentityRename(context: MetaEdGrammar.IdentityRenameContext): void {

        }
        public exitMetaEdId(context: MetaEdGrammar.MetaEdIdContext): void {

        }
        public exitProperty(context: MetaEdGrammar.PropertyContext): void {

        }
        public exitPropertyAnnotation(context: MetaEdGrammar.PropertyAnnotationContext): void {

        }
        public exitPropertyComponents(context: MetaEdGrammar.PropertyComponentsContext): void {

        }
        public exitPropertyName(context: MetaEdGrammar.PropertyNameContext): void {

        }
        public exitPropertyPath(context: MetaEdGrammar.PropertyPathContext): void {

        }
        public exitReferenceProperty(context: MetaEdGrammar.ReferencePropertyContext): void {

        }
        public exitRequired(context: MetaEdGrammar.RequiredContext): void {

        }
        public exitRequiredCollection(context: MetaEdGrammar.RequiredCollectionContext): void {

        }
        public exitRequiredMapType(context: MetaEdGrammar.RequiredMapTypeContext): void {

        }
        public exitSecondDomainEntity(context: MetaEdGrammar.SecondDomainEntityContext): void {

        }
        public exitSharedDecimalProperty(context: MetaEdGrammar.SharedDecimalPropertyContext): void {

        }
        public exitSharedIntegerProperty(context: MetaEdGrammar.SharedIntegerPropertyContext): void {

        }
        public exitSharedShortProperty(context: MetaEdGrammar.SharedShortPropertyContext): void {

        }
        public exitSharedStringProperty(context: MetaEdGrammar.SharedStringPropertyContext): void {

        }
        public exitSharedPropertyType(context: MetaEdGrammar.SharedPropertyTypeContext): void {

        }
        public exitShortDescription(context: MetaEdGrammar.ShortDescriptionContext): void {

        }
        public exitShortenToName(context: MetaEdGrammar.ShortenToNameContext): void {

        }
        public exitShortProperty(context: MetaEdGrammar.ShortPropertyContext): void {

        }
        public exitStringProperty(context: MetaEdGrammar.StringPropertyContext): void {

        }
        public exitSubdomain(context: MetaEdGrammar.SubdomainContext): void {

        }
        public exitParentDomainName(context: MetaEdGrammar.ParentDomainNameContext): void {

        }
        public exitSubdomainName(context: MetaEdGrammar.SubdomainNameContext): void {

        }
        public exitSubdomainPosition(context: MetaEdGrammar.SubdomainPositionContext): void {

        }
        public exitTargetPropertyPath(context: MetaEdGrammar.TargetPropertyPathContext): void {

        }
        public exitTimeProperty(context: MetaEdGrammar.TimePropertyContext): void {

        }
        public exitTopLevelEntity(context: MetaEdGrammar.TopLevelEntityContext): void {

        }
        public exitTotalDigits(context: MetaEdGrammar.TotalDigitsContext): void {

        }
        public exitUnaryOperator(context: MetaEdGrammar.UnaryOperatorContext): void {

        }
        public exitIsQueryableField(context: MetaEdGrammar.IsQueryableFieldContext): void {

        }
        public exitIsQueryableOnly(context: MetaEdGrammar.IsQueryableOnlyContext): void {

        }
        public exitWithContext(context: MetaEdGrammar.WithContextContext): void {

        }
        public exitWithContextName(context: MetaEdGrammar.WithContextNameContext): void {

        }
        public exitWithMapType(context: MetaEdGrammar.WithMapTypeContext): void {

        }
        public exitYearProperty(context: MetaEdGrammar.YearPropertyContext): void {

        }
        public enterEveryRule(ctx: ParserRuleContext): void {

        }
        public exitEveryRule(ctx: ParserRuleContext): void {

        }
        public visitErrorNode(node: IErrorNode): void {

        }
        public visitTerminal(node: ITerminalNode): void {

        }
    }
}