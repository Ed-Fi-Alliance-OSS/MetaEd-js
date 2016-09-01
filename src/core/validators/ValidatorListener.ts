/// <reference path="../../../src/grammar/gen/MetaEdGrammarListener.d.ts" />

let MetaEdGrammar = require("../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

import {MetaEdGrammarListener} from '../../../src/grammar/gen/MetaEdGrammarListener';
import {IValidationRule} from "./IValidationRule";
import {IMetaEdContext} from "../tasks/MetaEdContext";
import {IMetaEdFileIndex} from "../../grammar/IMetaEdFileIndex";
import {ISymbolTable} from "./SymbolTable";
import ValidationMessage from "../../common/ValidationMessage";
import {ValidationLevel} from "./ValidationLevel";

import {IListenerWithContext} from "./IListenerWithContext";
import {IRuleProvider} from "./RuleProvider";

export default class ValidatorListener extends MetaEdGrammarListener implements IListenerWithContext {
    private symbolTable: ISymbolTable;
    private metaEdFileIndex: IMetaEdFileIndex;
    private warningMessageCollection: ValidationMessage[];
    private errorMessageCollection: ValidationMessage[];
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

    private validateContext(context, ruleIndex: number) {
        const validationRules = this.ruleProvider.getAll(ruleIndex, this.symbolTable);
        if (validationRules.length === 0) return;

        validationRules.filter(x => x.level() == ValidationLevel.Error && !x.isValid(context))
            .forEach(y => this.errorMessageCollection.push(this.buildValidationMessage(y, context)));

        validationRules.filter(x => x.level() == ValidationLevel.Warning && !x.isValid(context))
            .forEach(y => this.warningMessageCollection.push(this.buildValidationMessage(y, context)));
    }

    private buildValidationMessage(validationRule: IValidationRule, context): ValidationMessage {
        const metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(context.start.line);
        return <ValidationMessage>{
            message: validationRule.getFailureMessage(context),
            characterPosition: context.start.column,
            concatenatedLineNumber: context.start.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
    }

    public enterAbstractEntity(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_abstractEntity);
    }

    public enterAbstractEntityName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_abstractEntityName);
    }

    public enterAssociation(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_association);
    }

    public enterAssociationExtension(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_associationExtension);
    }

    public enterAssociationName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_associationName);
    }

    public enterAssociationSubclass(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_associationSubclass);
    }

    public enterBaseKeyName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_baseKeyName);
    }

    public enterBaseName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_baseName);
    }

    public enterBooleanProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_booleanProperty);
    }

    public enterCascadeUpdate(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_cascadeUpdate);
    }

    public enterChoiceName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_choiceName);
    }

    public enterChoiceType(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_choiceType);
    }

    public enterCollection(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_collection);
    }

    public enterCommonDecimalName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_commonDecimalName);
    }

    public enterCommonDecimal(context): void {
        this.validateContext(context, MetaEdGrammar.RULE_commonDecimal);
    }

    public enterCommonIntegerName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_commonIntegerName);
    }

    public enterCommonInteger(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_commonInteger);
    }

    public enterCommonShortName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_commonShortName);
    }

    public enterCommonShort(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_commonShort);
    }

    public enterCommonStringName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_commonStringName);
    }

    public enterCommonString(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_commonString);
    }

    public enterCommonName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_commonName);
    }

    public enterCommonType(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_commonType);
    }

    public enterCommonTypeExtension(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_commonTypeExtension);
    }

    public enterCurrencyProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_currencyProperty);
    }

    public enterDateProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_dateProperty);
    }

    public enterDecimalPlaces(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_decimalPlaces);
    }

    public enterDecimalProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_decimalProperty);
    }

    public enterDecimalValue(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_decimalValue);
    }

    public enterDescriptor(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_descriptor);
    }

    public enterDescriptorName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_descriptorName);
    }

    public enterDescriptorProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_descriptorProperty);
    }

    public enterDocumentation(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_documentation);
    }

    public enterFooterDocumentation(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_footerDocumentation);
    }

    public enterExtendedDocumentation(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_extendedDocumentation);
    }

    public enterUseCaseDocumentation(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_useCaseDocumentation);
    }

    public enterDocumentationLine(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_documentationLine);
    }

    public enterDomain(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_domain);
    }

    public enterDomainItem(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_domainItem);
    }

    public enterDomainName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_domainName);
    }

    public enterDomainEntity(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_domainEntity);
    }

    public enterDomainEntityExtension(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_domainEntityExtension);
    }

    public enterDomainEntitySubclass(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_domainEntitySubclass);
    }

    public enterDurationProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_durationProperty);
    }

    public enterEntityConfiguration(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_entityConfiguration);
    }

    public enterEntityName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_entityName);
    }

    public enterEnumeration(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_enumeration);
    }

    public enterEnumerationName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_enumerationName);
    }

    public enterEnumerationProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_enumerationProperty);
    }

    public enterExtendeeName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_extendeeName);
    }

    public enterFirstDomainEntity(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_firstDomainEntity);
    }

    public enterIncludeProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_includeProperty);
    }

    public enterIncludeExtensionOverride(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_includeExtensionOverride);
    }

    public enterInlineCommonName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_inlineCommonName);
    }

    public enterInlineCommonType(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_inlineCommonType);
    }

    public enterSigned_int(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_signed_int);
    }

    public enterIntegerProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_integerProperty);
    }

    public enterInterchange(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_interchange);
    }

    public enterInterchangeComponent(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeComponent);
    }

    public enterInterchangeElement(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeElement);
    }

    public enterInterchangeExtension(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeExtension);
    }

    public enterInterchangeExtensionComponent(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeExtensionComponent);
    }

    public enterInterchangeIdentityTemplate(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeIdentityTemplate);
    }

    public enterInterchangeName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeName);
    }

    public enterEnumerationItem(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_enumerationItem);
    }

    public enterMaxLength(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_maxLength);
    }

    public enterMaxValue(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_maxValue);
    }

    public enterMaxValueDecimal(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_maxValueDecimal);
    }

    public enterIsWeakReference(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_isWeakReference);
    }

    public enterMergePartOfReference(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_mergePartOfReference);
    }

    public enterMergePropertyPath(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_mergePropertyPath);
    }

    public enterMetaEd(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_metaEd);
    }

    public enterMinLength(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_minLength);
    }

    public enterMinValue(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_minValue);
    }

    public enterMinValueDecimal(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_minValueDecimal);
    }

    public enterNamespace(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_namespace);
    }

    public enterNamespaceName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_namespaceName);
    }

    public enterNamespaceType(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_namespaceType);
    }

    public enterNamespaceProjectExtension(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_namespaceProjectExtension);
    }

    public enterOptional(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_optional);
    }

    public enterOptionalCollection(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_optionalCollection);
    }

    public enterOptionalMapType(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_optionalMapType);
    }

    public enterPercentProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_percentProperty);
    }

    public enterIdentity(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_identity);
    }

    public enterIdentityRename(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_identityRename);
    }

    public enterMetaEdId(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_metaEdId);
    }

    public enterProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_property);
    }

    public enterPropertyAnnotation(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_propertyAnnotation);
    }

    public enterPropertyComponents(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_propertyComponents);
    }

    public enterPropertyName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_propertyName);
    }

    public enterPropertyPath(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_propertyPath);
    }

    public enterReferenceProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_referenceProperty);
    }

    public enterRequired(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_required);
    }

    public enterRequiredCollection(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_requiredCollection);
    }

    public enterRequiredMapType(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_requiredMapType);
    }

    public enterSecondDomainEntity(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_secondDomainEntity);
    }

    public enterShortDescription(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_shortDescription);
    }

    public enterSharedDecimalProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_sharedDecimalProperty);
    }

    public enterSharedIntegerProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_sharedIntegerProperty);
    }

    public enterSharedShortProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_sharedShortProperty);
    }

    public enterSharedStringProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_sharedStringProperty);
    }

    public enterSharedPropertyType(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_sharedPropertyType);
    }

    public enterShortenToName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_shortenToName);
    }

    public enterShortProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_shortProperty);
    }

    public enterStringProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_stringProperty);
    }

    public enterSubdomain(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_subdomain);
    }

    public enterParentDomainName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_parentDomainName);
    }

    public enterSubdomainName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_subdomainName);
    }

    public enterSubdomainPosition(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_subdomainPosition);
    }

    public enterTargetPropertyPath(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_targetPropertyPath);
    }

    public enterTimeProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_timeProperty);
    }

    public enterTopLevelEntity(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_topLevelEntity);
    }

    public enterTotalDigits(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_totalDigits);
    }

    public enterUnaryOperator(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_unaryOperator);
    }

    public enterIsQueryableField(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_isQueryableField);
    }

    public enterIsQueryableOnly(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_isQueryableOnly);
    }

    public enterWithContext(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_withContext);
    }

    public enterWithContextName(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_withContextName);
    }

    public enterWithMapType(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_withMapType);
    }

    public enterYearProperty(context: any): void {
        this.validateContext(context, MetaEdGrammar.RULE_YearProperty);
    }

    public exitAbstractEntity(context: any): void {
    }

    public exitAbstractEntityName(context: any): void {
    }

    public exitAssociation(context: any): void {
    }

    public exitAssociationExtension(context: any): void {
    }

    public exitAssociationName(context: any): void {
    }

    public exitAssociationSubclass(context: any): void {
    }

    public exitBaseKeyName(context: any): void {
    }

    public exitBaseName(context: any): void {
    }

    public exitBooleanProperty(context: any): void {
    }

    public exitCascadeUpdate(context: any): void {
    }

    public exitChoiceName(context: any): void {
    }

    public exitChoiceType(context: any): void {
    }

    public exitCollection(context: any): void {
    }

    public exitCommonDecimalName(context: any): void {
    }

    public exitCommonDecimal(context: any): void {
    }

    public exitCommonIntegerName(context: any): void {
    }

    public exitCommonInteger(context: any): void {
    }

    public exitCommonShortName(context: any): void {
    }

    public exitCommonShort(context: any): void {
    }

    public exitCommonStringName(context: any): void {
    }

    public exitCommonString(context: any): void {
    }

    public exitCommonName(context: any): void {
    }

    public exitCommonType(context: any): void {
    }

    public exitCommonTypeExtension(context: any): void {
    }

    public exitCurrencyProperty(context: any): void {
    }

    public exitDateProperty(context: any): void {
    }

    public exitDecimalPlaces(context: any): void {
    }

    public exitDecimalProperty(context: any): void {
    }

    public exitDecimalValue(context: any): void {
    }

    public exitDescriptor(context: any): void {
    }

    public exitDescriptorName(context: any): void {
    }

    public exitDescriptorProperty(context: any): void {
    }

    public exitDocumentation(context: any): void {
    }

    public exitFooterDocumentation(context: any): void {
    }

    public exitExtendedDocumentation(context: any): void {
    }

    public exitUseCaseDocumentation(context: any): void {
    }

    public exitDocumentationLine(context: any): void {
    }

    public exitDomain(context: any): void {
    }

    public exitDomainItem(context: any): void {
    }

    public exitDomainName(context: any): void {
    }

    public exitDomainEntity(context: any): void {
    }

    public exitDomainEntityExtension(context: any): void {
    }

    public exitDomainEntitySubclass(context: any): void {
    }

    public exitDurationProperty(context: any): void {
    }

    public exitEntityConfiguration(context: any): void {
    }

    public exitEntityName(context: any): void {
    }

    public exitEnumeration(context: any): void {
    }

    public exitEnumerationName(context: any): void {
    }

    public exitEnumerationProperty(context: any): void {
    }

    public exitExtendeeName(context: any): void {
    }

    public exitFirstDomainEntity(context: any): void {
    }

    public exitIncludeProperty(context: any): void {
    }

    public exitIncludeExtensionOverride(context: any): void {
    }

    public exitInlineCommonName(context: any): void {
    }

    public exitInlineCommonType(context: any): void {
    }

    public exitSigned_int(context: any): void {
    }

    public exitIntegerProperty(context: any): void {
    }

    public exitInterchange(context: any): void {
    }

    public exitInterchangeComponent(context: any): void {
    }

    public exitInterchangeElement(context: any): void {
    }

    public exitInterchangeExtension(context: any): void {
    }

    public exitInterchangeExtensionComponent(context: any): void {
    }

    public exitInterchangeIdentityTemplate(context: any): void {
    }

    public exitInterchangeName(context: any): void {
    }

    public exitEnumerationItem(context: any): void {
    }

    public exitMaxLength(context: any): void {
    }

    public exitMaxValue(context: any): void {
    }

    public exitMaxValueDecimal(context: any): void {
    }

    public exitIsWeakReference(context: any): void {
    }

    public exitMergePartOfReference(context: any): void {
    }

    public exitMergePropertyPath(context: any): void {
    }

    public exitMetaEd(context: any): void {
    }

    public exitMinLength(context: any): void {
    }

    public exitMinValue(context: any): void {
    }

    public exitMinValueDecimal(context: any): void {
    }

    public exitNamespace(context: any): void {
    }

    public exitNamespaceName(context: any): void {
    }

    public exitNamespaceType(context: any): void {
    }

    public exitNamespaceProjectExtension(context: any): void {
    }

    public exitOptional(context: any): void {
    }

    public exitOptionalCollection(context: any): void {
    }

    public exitOptionalMapType(context: any): void {
    }

    public exitPercentProperty(context: any): void {
    }

    public exitIdentity(context: any): void {
    }

    public exitIdentityRename(context: any): void {
    }

    public exitMetaEdId(context: any): void {
    }

    public exitProperty(context: any): void {
    }

    public exitPropertyAnnotation(context: any): void {
    }

    public exitPropertyComponents(context: any): void {
    }

    public exitPropertyName(context: any): void {
    }

    public exitPropertyPath(context: any): void {
    }

    public exitReferenceProperty(context: any): void {
    }

    public exitRequired(context: any): void {
    }

    public exitRequiredCollection(context: any): void {
    }

    public exitRequiredMapType(context: any): void {
    }

    public exitSecondDomainEntity(context: any): void {
    }

    public exitSharedDecimalProperty(context: any): void {
    }

    public exitSharedIntegerProperty(context: any): void {
    }

    public exitSharedShortProperty(context: any): void {
    }

    public exitSharedStringProperty(context: any): void {
    }

    public exitSharedPropertyType(context: any): void {
    }

    public exitShortDescription(context: any): void {
    }

    public exitShortenToName(context: any): void {
    }

    public exitShortProperty(context: any): void {
    }

    public exitStringProperty(context: any): void {
    }

    public exitSubdomain(context: any): void {
    }

    public exitParentDomainName(context: any): void {
    }

    public exitSubdomainName(context: any): void {
    }

    public exitSubdomainPosition(context: any): void {
    }

    public exitTargetPropertyPath(context: any): void {
    }

    public exitTimeProperty(context: any): void {
    }

    public exitTopLevelEntity(context: any): void {
    }

    public exitTotalDigits(context: any): void {
    }

    public exitUnaryOperator(context: any): void {
    }

    public exitIsQueryableField(context: any): void {
    }

    public exitIsQueryableOnly(context: any): void {
    }

    public exitWithContext(context: any): void {
    }

    public exitWithContextName(context: any): void {
    }

    public exitWithMapType(context: any): void {
    }

    public exitYearProperty(context: any): void {
    }
}