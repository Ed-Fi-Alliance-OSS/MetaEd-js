/// <reference path="../../../src/grammar/gen/MetaEdGrammar.d.ts" />

import List from 'typescript-dotnet-commonjs/System/Collections/List'
import {AbstractEntityMustContainAnIdentity} from "./AbstractEntity/AbstractEntityMustContainAnIdentity";
import {IValidationRule} from "./IValidationRule";
import {IMetaEdContext} from "../tasks/MetaEdContext";
import {IMetaEdFileIndex} from "../../grammar/IMetaEdFileIndex";
import {ISymbolTable} from "./SymbolTable";
import ValidationMessage from "../../common/ValidationMessage";
import {ValidationLevel} from "./ValidationLevel";

import ParserRuleContext = MetaEdGrammar.ParserRuleContext;

export class ValidatorListener {
    private _symbolTable: ISymbolTable;
    private _metaEdFileIndex: IMetaEdFileIndex;
    private _warningMessageCollection: List<ValidationMessage>;
    private _errorMessageCollection: List<ValidationMessage>;

    public withContext(context: IMetaEdContext): void {
        this._metaEdFileIndex = context.MetaEdFileIndex;
        this._warningMessageCollection = context.WarningMessageCollection;
        this._errorMessageCollection = context.ErrorMessageCollection;
        this._symbolTable = context.SymbolTable;
    }

    private validateContext(validationRules: IValidationRule[], context: ParserRuleContext) {
        validationRules.filter(x => x.level() == ValidationLevel.Error && !x.isValid(context))
            .forEach(y => this._errorMessageCollection.add(this.buildValidationMessage(y, context)));

        validationRules.filter(x => x.level() == ValidationLevel.Warning && !x.isValid(context))
            .forEach(y => this._warningMessageCollection.add(this.buildValidationMessage(y, context)));
    }

    private buildValidationMessage(validationRule: IValidationRule, context: ParserRuleContext) : ValidationMessage {
        const metaEdFile = this._metaEdFileIndex.getFileAndLineNumber(context.start.line);
        return <ValidationMessage> {
            message: validationRule.getFailureMessage(context),
            characterPosition: context.start.column,
            concatenatedLineNumber: context.start.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
    }

    public enterAbstractEntity(context: MetaEdGrammar.AbstractEntityContext) : void {
        var validationRules = [ new AbstractEntityMustContainAnIdentity() ];
        this.validateContext(validationRules, context);
    }

    // public enterAbstractEntityName(context: MetaEdGrammar.AbstractEntityNameContext) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterAssociation(context: MetaEdGrammar.AssociationContext) : void {
    //     this.validateContext(context);
    // }

    // public enterAssociationExtension(context: MetaEdGrammar.AssociationExtensionContext) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterAssociationName(context: MetaEdGrammar.AssociationNameContext) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterAssociationSubclass(MetaEdGrammar.AssociationSubclassContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterBaseKeyName(MetaEdGrammar.BaseKeyNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterBaseName(MetaEdGrammar.BaseNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterBooleanProperty(MetaEdGrammar.BooleanPropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCascadeUpdate(MetaEdGrammar.CascadeUpdateContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterChoiceName(MetaEdGrammar.ChoiceNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterChoiceType(MetaEdGrammar.ChoiceTypeContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCollection(MetaEdGrammar.CollectionContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCommonDecimalName(MetaEdGrammar.CommonDecimalNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCommonDecimal(MetaEdGrammar.CommonDecimalContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCommonIntegerName(MetaEdGrammar.CommonIntegerNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCommonInteger(MetaEdGrammar.CommonIntegerContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCommonShortName(MetaEdGrammar.CommonShortNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCommonShort(MetaEdGrammar.CommonShortContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCommonStringName(MetaEdGrammar.CommonStringNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCommonString(MetaEdGrammar.CommonStringContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCommonName(MetaEdGrammar.CommonNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCommonType(MetaEdGrammar.CommonTypeContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCommonTypeExtension(MetaEdGrammar.CommonTypeExtensionContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterCurrencyProperty(MetaEdGrammar.CurrencyPropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDateProperty(MetaEdGrammar.DatePropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDecimalPlaces(MetaEdGrammar.DecimalPlacesContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDecimalProperty(MetaEdGrammar.DecimalPropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDecimalValue(MetaEdGrammar.DecimalValueContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDescriptor(MetaEdGrammar.DescriptorContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDescriptorName(MetaEdGrammar.DescriptorNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDescriptorProperty(MetaEdGrammar.DescriptorPropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDocumentation(MetaEdGrammar.DocumentationContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterFooterDocumentation(MetaEdGrammar.FooterDocumentationContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterExtendedDocumentation(MetaEdGrammar.ExtendedDocumentationContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterUseCaseDocumentation(MetaEdGrammar.UseCaseDocumentationContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDocumentationLine(MetaEdGrammar.DocumentationLineContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDomain(MetaEdGrammar.DomainContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDomainItem(MetaEdGrammar.DomainItemContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDomainName(MetaEdGrammar.DomainNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDomainEntity(MetaEdGrammar.DomainEntityContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDomainEntityExtension(MetaEdGrammar.DomainEntityExtensionContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDomainEntitySubclass(MetaEdGrammar.DomainEntitySubclassContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterDurationProperty(MetaEdGrammar.DurationPropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterEntityConfiguration(MetaEdGrammar.EntityConfigurationContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterEntityName(MetaEdGrammar.EntityNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterEnumeration(MetaEdGrammar.EnumerationContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterEnumerationName(MetaEdGrammar.EnumerationNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterEnumerationProperty(MetaEdGrammar.EnumerationPropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterExtendeeName(MetaEdGrammar.ExtendeeNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterFirstDomainEntity(MetaEdGrammar.FirstDomainEntityContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterIncludeProperty(MetaEdGrammar.IncludePropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterIncludeExtensionOverride(MetaEdGrammar.IncludeExtensionOverrideContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterInlineCommonName(MetaEdGrammar.InlineCommonNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterInlineCommonType(MetaEdGrammar.InlineCommonTypeContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterSigned_int(MetaEdGrammar.Signed_intContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterIntegerProperty(MetaEdGrammar.IntegerPropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterInterchange(MetaEdGrammar.InterchangeContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterInterchangeComponent(MetaEdGrammar.InterchangeComponentContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterInterchangeElement(MetaEdGrammar.InterchangeElementContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterInterchangeExtension(MetaEdGrammar.InterchangeExtensionContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterInterchangeExtensionComponent(MetaEdGrammar.InterchangeExtensionComponentContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterInterchangeIdentityTemplate(MetaEdGrammar.InterchangeIdentityTemplateContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterInterchangeName(MetaEdGrammar.InterchangeNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterEnumerationItem(MetaEdGrammar.EnumerationItemContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterMaxLength(MetaEdGrammar.MaxLengthContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterMaxValue(MetaEdGrammar.MaxValueContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterMaxValueDecimal(MetaEdGrammar.MaxValueDecimalContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterIsWeakReference(MetaEdGrammar.IsWeakReferenceContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterMergePartOfReference(MetaEdGrammar.MergePartOfReferenceContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterMergePropertyPath(MetaEdGrammar.MergePropertyPathContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterMetaEd(MetaEdGrammar.MetaEdContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterMinLength(MetaEdGrammar.MinLengthContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterMinValue(MetaEdGrammar.MinValueContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterMinValueDecimal(MetaEdGrammar.MinValueDecimalContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterNamespace(MetaEdGrammar.NamespaceContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterNamespaceName(MetaEdGrammar.NamespaceNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterNamespaceType(MetaEdGrammar.NamespaceTypeContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterNamespaceProjectExtension(MetaEdGrammar.NamespaceProjectExtensionContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterOptional(MetaEdGrammar.OptionalContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterOptionalCollection(MetaEdGrammar.OptionalCollectionContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterOptionalMapType(MetaEdGrammar.OptionalMapTypeContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterPercentProperty(MetaEdGrammar.PercentPropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterIdentity(MetaEdGrammar.IdentityContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterIdentityRename(MetaEdGrammar.IdentityRenameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterMetaEdId(MetaEdGrammar.MetaEdIdContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterProperty(MetaEdGrammar.PropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterPropertyAnnotation(MetaEdGrammar.PropertyAnnotationContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterPropertyComponents(MetaEdGrammar.PropertyComponentsContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterPropertyName(MetaEdGrammar.PropertyNameContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterPropertyPath(MetaEdGrammar.PropertyPathContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterReferenceProperty(MetaEdGrammar.ReferencePropertyContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterRequired(MetaEdGrammar.RequiredContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterRequiredCollection(MetaEdGrammar.RequiredCollectionContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterRequiredMapType(MetaEdGrammar.RequiredMapTypeContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterSecondDomainEntity(MetaEdGrammar.SecondDomainEntityContext context) : void {
    //     this.validateContext(context);
    // }
    //
    // public enterShortDescription(MetaEdGrammar.ShortDescriptionContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterSharedDecimalProperty(MetaEdGrammar.SharedDecimalPropertyContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterSharedIntegerProperty(MetaEdGrammar.SharedIntegerPropertyContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterSharedShortProperty(MetaEdGrammar.SharedShortPropertyContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterSharedStringProperty(MetaEdGrammar.SharedStringPropertyContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterSharedPropertyType(MetaEdGrammar.SharedPropertyTypeContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterShortenToName(MetaEdGrammar.ShortenToNameContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterShortProperty(MetaEdGrammar.ShortPropertyContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterStringProperty(MetaEdGrammar.StringPropertyContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterSubdomain(MetaEdGrammar.SubdomainContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterParentDomainName(MetaEdGrammar.ParentDomainNameContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterSubdomainName(MetaEdGrammar.SubdomainNameContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterSubdomainPosition(MetaEdGrammar.SubdomainPositionContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterTargetPropertyPath(MetaEdGrammar.TargetPropertyPathContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterTimeProperty(MetaEdGrammar.TimePropertyContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterTopLevelEntity(MetaEdGrammar.TopLevelEntityContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterTotalDigits(MetaEdGrammar.TotalDigitsContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterUnaryOperator(MetaEdGrammar.UnaryOperatorContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterIsQueryableField(MetaEdGrammar.IsQueryableFieldContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterIsQueryableOnly(MetaEdGrammar.IsQueryableOnlyContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterWithContext(MetaEdGrammar.WithContextContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterWithContextName(MetaEdGrammar.WithContextNameContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterWithMapType(MetaEdGrammar.WithMapTypeContext context) : void {
    //
    //     this.validateContext(context);
    // }
    //
    // public enterYearProperty(MetaEdGrammar.YearPropertyContext context) : void {
    //
    //     this.validateContext(context);
    // }
}