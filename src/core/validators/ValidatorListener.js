/// <reference path="../../../src/grammar/gen/MetaEdGrammarListener.d.ts" />
"use strict";
let MetaEdGrammar = require("../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
const MetaEdGrammarListener_1 = require('../../../src/grammar/gen/MetaEdGrammarListener');
const ValidationLevel_1 = require("./ValidationLevel");
class ValidatorListener extends MetaEdGrammarListener_1.MetaEdGrammarListener {
    constructor(ruleProvider) {
        super();
        this.ruleProvider = ruleProvider;
    }
    withContext(context) {
        this.metaEdFileIndex = context.metaEdFileIndex;
        this.warningMessageCollection = context.warningMessageCollection;
        this.errorMessageCollection = context.errorMessageCollection;
        this.symbolTable = context.symbolTable;
    }
    validateContext(context, ruleIndex) {
        const validationRules = this.ruleProvider.getAll(ruleIndex, this.symbolTable);
        validationRules.filter(x => x.level() == ValidationLevel_1.ValidationLevel.Error && !x.isValid(context))
            .forEach(y => this.errorMessageCollection.push(this.buildValidationMessage(y, context)));
        validationRules.filter(x => x.level() == ValidationLevel_1.ValidationLevel.Warning && !x.isValid(context))
            .forEach(y => this.warningMessageCollection.push(this.buildValidationMessage(y, context)));
    }
    buildValidationMessage(validationRule, context) {
        const metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(context.start.line);
        return {
            message: validationRule.getFailureMessage(context),
            characterPosition: context.start.column,
            concatenatedLineNumber: context.start.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
    }
    enterAbstractEntity(context) {
        this.validateContext(context, MetaEdGrammar.RULE_abstractEntity);
    }
    enterMetaEd(context) {
        this.validateContext(context, MetaEdGrammar.RULE_metaEd);
    }
    enterAbstractEntityName(context) {
        this.validateContext(context);
    }
    enterAssociation(context) {
        this.validateContext(context);
    }
    enterAssociationExtension(context) {
        this.validateContext(context);
    }
    enterAssociationName(context) {
        this.validateContext(context);
    }
    enterAssociationSubclass(context) {
        this.validateContext(context);
    }
    enterBaseKeyName(context) {
        this.validateContext(context);
    }
    enterBaseName(context) {
        this.validateContext(context);
    }
    enterBooleanProperty(context) {
        this.validateContext(context);
    }
    enterCascadeUpdate(context) {
        this.validateContext(context);
    }
    enterChoiceName(context) {
        this.validateContext(context);
    }
    enterChoiceType(context) {
        this.validateContext(context);
    }
    enterCollection(context) {
        this.validateContext(context);
    }
    enterCommonDecimalName(context) {
        this.validateContext(context);
    }
    enterCommonDecimal(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonDecimal);
    }
    enterCommonIntegerName(context) {
        this.validateContext(context);
    }
    enterCommonInteger(context) {
        this.validateContext(context);
    }
    enterCommonShortName(context) {
        this.validateContext(context);
    }
    enterCommonShort(context) {
        this.validateContext(context);
    }
    enterCommonStringName(context) {
        this.validateContext(context);
    }
    enterCommonString(context) {
        this.validateContext(context);
    }
    enterCommonName(context) {
        this.validateContext(context);
    }
    enterCommonType(context) {
        this.validateContext(context);
    }
    enterCommonTypeExtension(context) {
        this.validateContext(context);
    }
    enterCurrencyProperty(context) {
        this.validateContext(context);
    }
    enterDateProperty(context) {
        this.validateContext(context);
    }
    enterDecimalPlaces(context) {
        this.validateContext(context);
    }
    enterDecimalProperty(context) {
        this.validateContext(context);
    }
    enterDecimalValue(context) {
        this.validateContext(context);
    }
    enterDescriptor(context) {
        this.validateContext(context);
    }
    enterDescriptorName(context) {
        this.validateContext(context);
    }
    enterDescriptorProperty(context) {
        this.validateContext(context);
    }
    enterDocumentation(context) {
        this.validateContext(context);
    }
    enterFooterDocumentation(context) {
        this.validateContext(context);
    }
    enterExtendedDocumentation(context) {
        this.validateContext(context);
    }
    enterUseCaseDocumentation(context) {
        this.validateContext(context);
    }
    enterDocumentationLine(context) {
        this.validateContext(context);
    }
    enterDomain(context) {
        this.validateContext(context);
    }
    enterDomainItem(context) {
        this.validateContext(context);
    }
    enterDomainName(context) {
        this.validateContext(context);
    }
    enterDomainEntity(context) {
        this.validateContext(context);
    }
    enterDomainEntityExtension(context) {
        this.validateContext(context);
    }
    enterDomainEntitySubclass(context) {
        this.validateContext(context);
    }
    enterDurationProperty(context) {
        this.validateContext(context);
    }
    enterEntityConfiguration(context) {
        this.validateContext(context);
    }
    enterEntityName(context) {
        this.validateContext(context);
    }
    enterEnumeration(context) {
        this.validateContext(context);
    }
    enterEnumerationName(context) {
        this.validateContext(context);
    }
    enterEnumerationProperty(context) {
        this.validateContext(context);
    }
    enterExtendeeName(context) {
        this.validateContext(context);
    }
    enterFirstDomainEntity(context) {
        this.validateContext(context);
    }
    enterIncludeProperty(context) {
        this.validateContext(context);
    }
    enterIncludeExtensionOverride(context) {
    }
    enterInlineCommonName(context) {
        this.validateContext(context);
    }
    enterInlineCommonType(context) {
        this.validateContext(context);
    }
    enterSigned_int(context) {
        this.validateContext(context);
    }
    enterIntegerProperty(context) {
        this.validateContext(context);
    }
    enterInterchange(context) {
        this.validateContext(context);
    }
    enterInterchangeComponent(context) {
        this.validateContext(context);
    }
    enterInterchangeElement(context) {
        this.validateContext(context);
    }
    enterInterchangeExtension(context) {
        this.validateContext(context);
    }
    enterInterchangeExtensionComponent(context) {
        this.validateContext(context);
    }
    enterInterchangeIdentityTemplate(context) {
        this.validateContext(context);
    }
    enterInterchangeName(context) {
        this.validateContext(context);
    }
    enterEnumerationItem(context) {
        this.validateContext(context);
    }
    enterMaxLength(context) {
        this.validateContext(context);
    }
    enterMaxValue(context) {
        this.validateContext(context);
    }
    enterMaxValueDecimal(context) {
        this.validateContext(context);
    }
    enterIsWeakReference(context) {
        this.validateContext(context);
    }
    enterMergePartOfReference(context) {
        this.validateContext(context);
    }
    enterMergePropertyPath(context) {
        this.validateContext(context);
    }
    enterMetaEd(context) {
        this.validateContext(context);
    }
    enterMinLength(context) {
        this.validateContext(context);
    }
    enterMinValue(context) {
        this.validateContext(context);
    }
    enterMinValueDecimal(context) {
        this.validateContext(context);
    }
    enterNamespace(context) {
        this.validateContext(context);
    }
    enterNamespaceName(context) {
        this.validateContext(context);
    }
    enterNamespaceType(context) {
        this.validateContext(context);
    }
    enterNamespaceProjectExtension(context) {
        this.validateContext(context);
    }
    enterOptional(context) {
        this.validateContext(context);
    }
    enterOptionalCollection(context) {
        this.validateContext(context);
    }
    enterOptionalMapType(context) {
        this.validateContext(context);
    }
    enterPercentProperty(context) {
        this.validateContext(context);
    }
    enterIdentity(context) {
        this.validateContext(context);
    }
    enterIdentityRename(context) {
        this.validateContext(context);
    }
    enterMetaEdId(context) {
        this.validateContext(context);
    }
    enterProperty(context) {
        this.validateContext(context);
    }
    enterPropertyAnnotation(context) {
        this.validateContext(context);
    }
    enterPropertyComponents(context) {
        this.validateContext(context);
    }
    enterPropertyName(context) {
        this.validateContext(context);
    }
    enterPropertyPath(context) {
        this.validateContext(context);
    }
    enterReferenceProperty(context) {
        this.validateContext(context);
    }
    enterRequired(context) {
        this.validateContext(context);
    }
    enterRequiredCollection(context) {
        this.validateContext(context);
    }
    enterRequiredMapType(context) {
        this.validateContext(context);
    }
    enterSecondDomainEntity(context) {
        this.validateContext(context);
    }
    enterShortDescription(context) {
        this.validateContext(context);
    }
    enterSharedDecimalProperty(context) {
        this.validateContext(context);
    }
    enterSharedIntegerProperty(context) {
        this.validateContext(context);
    }
    enterSharedShortProperty(context) {
        this.validateContext(context);
    }
    enterSharedStringProperty(context) {
        this.validateContext(context);
    }
    enterSharedPropertyType(context) {
        this.validateContext(context);
    }
    enterShortenToName(context) {
        this.validateContext(context);
    }
    enterShortProperty(context) {
        this.validateContext(context);
    }
    enterStringProperty(context) {
        this.validateContext(context);
    }
    enterSubdomain(context) {
        this.validateContext(context);
    }
    enterParentDomainName(context) {
        this.validateContext(context);
    }
    enterSubdomainName(context) {
        this.validateContext(context);
    }
    enterSubdomainPosition(context) {
        this.validateContext(context);
    }
    enterTargetPropertyPath(context) {
        this.validateContext(context);
    }
    enterTimeProperty(context) {
        this.validateContext(context);
    }
    enterTopLevelEntity(context) {
        this.validateContext(context);
    }
    enterTotalDigits(context) {
        this.validateContext(context);
    }
    enterUnaryOperator(context) {
        this.validateContext(context);
    }
    enterIsQueryableField(context) {
        this.validateContext(context);
    }
    enterIsQueryableOnly(context) {
        this.validateContext(context);
    }
    enterWithContext(context) {
        this.validateContext(context);
    }
    enterWithContextName(context) {
        this.validateContext(context);
    }
    enterWithMapType(context) {
        this.validateContext(context);
    }
    enterYearProperty(context) {
        this.validateContext(context);
    }
    exitAbstractEntity(context) {
    }
    exitAbstractEntityName(context) {
    }
    exitAssociation(context) {
    }
    exitAssociationExtension(context) {
    }
    exitAssociationName(context) {
    }
    exitAssociationSubclass(context) {
    }
    exitBaseKeyName(context) {
    }
    exitBaseName(context) {
    }
    exitBooleanProperty(context) {
    }
    exitCascadeUpdate(context) {
    }
    exitChoiceName(context) {
    }
    exitChoiceType(context) {
    }
    exitCollection(context) {
    }
    exitCommonDecimalName(context) {
    }
    exitCommonDecimal(context) {
    }
    exitCommonIntegerName(context) {
    }
    exitCommonInteger(context) {
    }
    exitCommonShortName(context) {
    }
    exitCommonShort(context) {
    }
    exitCommonStringName(context) {
    }
    exitCommonString(context) {
    }
    exitCommonName(context) {
    }
    exitCommonType(context) {
    }
    exitCommonTypeExtension(context) {
    }
    exitCurrencyProperty(context) {
    }
    exitDateProperty(context) {
    }
    exitDecimalPlaces(context) {
    }
    exitDecimalProperty(context) {
    }
    exitDecimalValue(context) {
    }
    exitDescriptor(context) {
    }
    exitDescriptorName(context) {
    }
    exitDescriptorProperty(context) {
    }
    exitDocumentation(context) {
    }
    exitFooterDocumentation(context) {
    }
    exitExtendedDocumentation(context) {
    }
    exitUseCaseDocumentation(context) {
    }
    exitDocumentationLine(context) {
    }
    exitDomain(context) {
    }
    exitDomainItem(context) {
    }
    exitDomainName(context) {
    }
    exitDomainEntity(context) {
    }
    exitDomainEntityExtension(context) {
    }
    exitDomainEntitySubclass(context) {
    }
    exitDurationProperty(context) {
    }
    exitEntityConfiguration(context) {
    }
    exitEntityName(context) {
    }
    exitEnumeration(context) {
    }
    exitEnumerationName(context) {
    }
    exitEnumerationProperty(context) {
    }
    exitExtendeeName(context) {
    }
    exitFirstDomainEntity(context) {
    }
    exitIncludeProperty(context) {
    }
    exitIncludeExtensionOverride(context) {
    }
    exitInlineCommonName(context) {
    }
    exitInlineCommonType(context) {
    }
    exitSigned_int(context) {
    }
    exitIntegerProperty(context) {
    }
    exitInterchange(context) {
    }
    exitInterchangeComponent(context) {
    }
    exitInterchangeElement(context) {
    }
    exitInterchangeExtension(context) {
    }
    exitInterchangeExtensionComponent(context) {
    }
    exitInterchangeIdentityTemplate(context) {
    }
    exitInterchangeName(context) {
    }
    exitEnumerationItem(context) {
    }
    exitMaxLength(context) {
    }
    exitMaxValue(context) {
    }
    exitMaxValueDecimal(context) {
    }
    exitIsWeakReference(context) {
    }
    exitMergePartOfReference(context) {
    }
    exitMergePropertyPath(context) {
    }
    exitMetaEd(context) {
    }
    exitMinLength(context) {
    }
    exitMinValue(context) {
    }
    exitMinValueDecimal(context) {
    }
    exitNamespace(context) {
    }
    exitNamespaceName(context) {
    }
    exitNamespaceType(context) {
    }
    exitNamespaceProjectExtension(context) {
    }
    exitOptional(context) {
    }
    exitOptionalCollection(context) {
    }
    exitOptionalMapType(context) {
    }
    exitPercentProperty(context) {
    }
    exitIdentity(context) {
    }
    exitIdentityRename(context) {
    }
    exitMetaEdId(context) {
    }
    exitProperty(context) {
    }
    exitPropertyAnnotation(context) {
    }
    exitPropertyComponents(context) {
    }
    exitPropertyName(context) {
    }
    exitPropertyPath(context) {
    }
    exitReferenceProperty(context) {
    }
    exitRequired(context) {
    }
    exitRequiredCollection(context) {
    }
    exitRequiredMapType(context) {
    }
    exitSecondDomainEntity(context) {
    }
    exitSharedDecimalProperty(context) {
    }
    exitSharedIntegerProperty(context) {
    }
    exitSharedShortProperty(context) {
    }
    exitSharedStringProperty(context) {
    }
    exitSharedPropertyType(context) {
    }
    exitShortDescription(context) {
    }
    exitShortenToName(context) {
    }
    exitShortProperty(context) {
    }
    exitStringProperty(context) {
    }
    exitSubdomain(context) {
    }
    exitParentDomainName(context) {
    }
    exitSubdomainName(context) {
    }
    exitSubdomainPosition(context) {
    }
    exitTargetPropertyPath(context) {
    }
    exitTimeProperty(context) {
    }
    exitTopLevelEntity(context) {
    }
    exitTotalDigits(context) {
    }
    exitUnaryOperator(context) {
    }
    exitIsQueryableField(context) {
    }
    exitIsQueryableOnly(context) {
    }
    exitWithContext(context) {
    }
    exitWithContextName(context) {
    }
    exitWithMapType(context) {
    }
    exitYearProperty(context) {
    }
    enterEveryRule(ctx) {
    }
    exitEveryRule(ctx) {
    }
}
exports.ValidatorListener = ValidatorListener;
//# sourceMappingURL=ValidatorListener.js.map