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
    enterAbstractEntityName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_abstractEntityName);
    }
    enterAssociation(context) {
        this.validateContext(context, MetaEdGrammar.RULE_association);
    }
    enterAssociationExtension(context) {
        this.validateContext(context, MetaEdGrammar.RULE_associationExtension);
    }
    enterAssociationName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_associationName);
    }
    enterAssociationSubclass(context) {
        this.validateContext(context, MetaEdGrammar.RULE_associationSubclass);
    }
    enterBaseKeyName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_baseKeyName);
    }
    enterBaseName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_baseName);
    }
    enterBooleanProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_booleanProperty);
    }
    enterCascadeUpdate(context) {
        this.validateContext(context, MetaEdGrammar.RULE_cascadeUpdate);
    }
    enterChoiceName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_choiceName);
    }
    enterChoiceType(context) {
        this.validateContext(context, MetaEdGrammar.RULE_choiceType);
    }
    enterCollection(context) {
        this.validateContext(context, MetaEdGrammar.RULE_collection);
    }
    enterCommonDecimalName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonDecimalName);
    }
    enterCommonDecimal(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonDecimal);
    }
    enterCommonIntegerName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonIntegerName);
    }
    enterCommonInteger(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonInteger);
    }
    enterCommonShortName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonShortName);
    }
    enterCommonShort(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonShort);
    }
    enterCommonStringName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonStringName);
    }
    enterCommonString(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonString);
    }
    enterCommonName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonName);
    }
    enterCommonType(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonType);
    }
    enterCommonTypeExtension(context) {
        this.validateContext(context, MetaEdGrammar.RULE_commonTypeExtension);
    }
    enterCurrencyProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_currencyProperty);
    }
    enterDateProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_dateProperty);
    }
    enterDecimalPlaces(context) {
        this.validateContext(context, MetaEdGrammar.RULE_decimalPlaces);
    }
    enterDecimalProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_decimalProperty);
    }
    enterDecimalValue(context) {
        this.validateContext(context, MetaEdGrammar.RULE_decimalValue);
    }
    enterDescriptor(context) {
        this.validateContext(context, MetaEdGrammar.RULE_descriptor);
    }
    enterDescriptorName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_descriptorName);
    }
    enterDescriptorProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_descriptorProperty);
    }
    enterDocumentation(context) {
        this.validateContext(context, MetaEdGrammar.RULE_documentation);
    }
    enterFooterDocumentation(context) {
        this.validateContext(context, MetaEdGrammar.RULE_footerDocumentation);
    }
    enterExtendedDocumentation(context) {
        this.validateContext(context, MetaEdGrammar.RULE_extendedDocumentation);
    }
    enterUseCaseDocumentation(context) {
        this.validateContext(context, MetaEdGrammar.RULE_useCaseDocumentation);
    }
    enterDocumentationLine(context) {
        this.validateContext(context, MetaEdGrammar.RULE_documentationLine);
    }
    enterDomain(context) {
        this.validateContext(context, MetaEdGrammar.RULE_domain);
    }
    enterDomainItem(context) {
        this.validateContext(context, MetaEdGrammar.RULE_domainItem);
    }
    enterDomainName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_domainName);
    }
    enterDomainEntity(context) {
        this.validateContext(context, MetaEdGrammar.RULE_domainEntity);
    }
    enterDomainEntityExtension(context) {
        this.validateContext(context, MetaEdGrammar.RULE_domainEntityExtension);
    }
    enterDomainEntitySubclass(context) {
        this.validateContext(context, MetaEdGrammar.RULE_domainEntitySubclass);
    }
    enterDurationProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_durationProperty);
    }
    enterEntityConfiguration(context) {
        this.validateContext(context, MetaEdGrammar.RULE_entityConfiguration);
    }
    enterEntityName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_entityName);
    }
    enterEnumeration(context) {
        this.validateContext(context, MetaEdGrammar.RULE_enumeration);
    }
    enterEnumerationName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_enumerationName);
    }
    enterEnumerationProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_enumerationProperty);
    }
    enterExtendeeName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_extendeeName);
    }
    enterFirstDomainEntity(context) {
        this.validateContext(context, MetaEdGrammar.RULE_firstDomainEntity);
    }
    enterIncludeProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_includeProperty);
    }
    enterIncludeExtensionOverride(context) {
        this.validateContext(context, MetaEdGrammar.RULE_includeExtensionOverride);
    }
    enterInlineCommonName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_inlineCommonName);
    }
    enterInlineCommonType(context) {
        this.validateContext(context, MetaEdGrammar.RULE_inlineCommonType);
    }
    enterSigned_int(context) {
        this.validateContext(context, MetaEdGrammar.RULE_signed_int);
    }
    enterIntegerProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_integerProperty);
    }
    enterInterchange(context) {
        this.validateContext(context, MetaEdGrammar.RULE_interchange);
    }
    enterInterchangeComponent(context) {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeComponent);
    }
    enterInterchangeElement(context) {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeElement);
    }
    enterInterchangeExtension(context) {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeExtension);
    }
    enterInterchangeExtensionComponent(context) {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeExtensionComponent);
    }
    enterInterchangeIdentityTemplate(context) {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeIdentityTemplate);
    }
    enterInterchangeName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_interchangeName);
    }
    enterEnumerationItem(context) {
        this.validateContext(context, MetaEdGrammar.RULE_enumerationItem);
    }
    enterMaxLength(context) {
        this.validateContext(context, MetaEdGrammar.RULE_maxLength);
    }
    enterMaxValue(context) {
        this.validateContext(context, MetaEdGrammar.RULE_maxValue);
    }
    enterMaxValueDecimal(context) {
        this.validateContext(context, MetaEdGrammar.RULE_maxValueDecimal);
    }
    enterIsWeakReference(context) {
        this.validateContext(context, MetaEdGrammar.RULE_isWeakReference);
    }
    enterMergePartOfReference(context) {
        this.validateContext(context, MetaEdGrammar.RULE_mergePartOfReference);
    }
    enterMergePropertyPath(context) {
        this.validateContext(context, MetaEdGrammar.RULE_mergePropertyPath);
    }
    enterMetaEd(context) {
        this.validateContext(context, MetaEdGrammar.RULE_metaEd);
    }
    enterMinLength(context) {
        this.validateContext(context, MetaEdGrammar.RULE_minLength);
    }
    enterMinValue(context) {
        this.validateContext(context, MetaEdGrammar.RULE_minValue);
    }
    enterMinValueDecimal(context) {
        this.validateContext(context, MetaEdGrammar.RULE_minValueDecimal);
    }
    enterNamespace(context) {
        this.validateContext(context, MetaEdGrammar.RULE_namespace);
    }
    enterNamespaceName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_namespaceName);
    }
    enterNamespaceType(context) {
        this.validateContext(context, MetaEdGrammar.RULE_namespaceType);
    }
    enterNamespaceProjectExtension(context) {
        this.validateContext(context, MetaEdGrammar.RULE_namespaceProjectExtension);
    }
    enterOptional(context) {
        this.validateContext(context, MetaEdGrammar.RULE_optional);
    }
    enterOptionalCollection(context) {
        this.validateContext(context, MetaEdGrammar.RULE_optionalCollection);
    }
    enterOptionalMapType(context) {
        this.validateContext(context, MetaEdGrammar.RULE_optionalMapType);
    }
    enterPercentProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_percentProperty);
    }
    enterIdentity(context) {
        this.validateContext(context, MetaEdGrammar.RULE_identity);
    }
    enterIdentityRename(context) {
        this.validateContext(context, MetaEdGrammar.RULE_identityRename);
    }
    enterMetaEdId(context) {
        this.validateContext(context, MetaEdGrammar.RULE_metaEdId);
    }
    enterProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_property);
    }
    enterPropertyAnnotation(context) {
        this.validateContext(context, MetaEdGrammar.RULE_propertyAnnotation);
    }
    enterPropertyComponents(context) {
        this.validateContext(context, MetaEdGrammar.RULE_propertyComponents);
    }
    enterPropertyName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_propertyName);
    }
    enterPropertyPath(context) {
        this.validateContext(context, MetaEdGrammar.RULE_propertyPath);
    }
    enterReferenceProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_referenceProperty);
    }
    enterRequired(context) {
        this.validateContext(context, MetaEdGrammar.RULE_required);
    }
    enterRequiredCollection(context) {
        this.validateContext(context, MetaEdGrammar.RULE_requiredCollection);
    }
    enterRequiredMapType(context) {
        this.validateContext(context, MetaEdGrammar.RULE_requiredMapType);
    }
    enterSecondDomainEntity(context) {
        this.validateContext(context, MetaEdGrammar.RULE_secondDomainEntity);
    }
    enterShortDescription(context) {
        this.validateContext(context, MetaEdGrammar.RULE_shortDescription);
    }
    enterSharedDecimalProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_sharedDecimalProperty);
    }
    enterSharedIntegerProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_sharedIntegerProperty);
    }
    enterSharedShortProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_sharedShortProperty);
    }
    enterSharedStringProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_sharedStringProperty);
    }
    enterSharedPropertyType(context) {
        this.validateContext(context, MetaEdGrammar.RULE_sharedPropertyType);
    }
    enterShortenToName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_shortenToName);
    }
    enterShortProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_shortProperty);
    }
    enterStringProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_stringProperty);
    }
    enterSubdomain(context) {
        this.validateContext(context, MetaEdGrammar.RULE_subdomain);
    }
    enterParentDomainName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_parentDomainName);
    }
    enterSubdomainName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_subdomainName);
    }
    enterSubdomainPosition(context) {
        this.validateContext(context, MetaEdGrammar.RULE_subdomainPosition);
    }
    enterTargetPropertyPath(context) {
        this.validateContext(context, MetaEdGrammar.RULE_targetPropertyPath);
    }
    enterTimeProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_timeProperty);
    }
    enterTopLevelEntity(context) {
        this.validateContext(context, MetaEdGrammar.RULE_topLevelEntity);
    }
    enterTotalDigits(context) {
        this.validateContext(context, MetaEdGrammar.RULE_totalDigits);
    }
    enterUnaryOperator(context) {
        this.validateContext(context, MetaEdGrammar.RULE_unaryOperator);
    }
    enterIsQueryableField(context) {
        this.validateContext(context, MetaEdGrammar.RULE_isQueryableField);
    }
    enterIsQueryableOnly(context) {
        this.validateContext(context, MetaEdGrammar.RULE_isQueryableOnly);
    }
    enterWithContext(context) {
        this.validateContext(context, MetaEdGrammar.RULE_withContext);
    }
    enterWithContextName(context) {
        this.validateContext(context, MetaEdGrammar.RULE_withContextName);
    }
    enterWithMapType(context) {
        this.validateContext(context, MetaEdGrammar.RULE_withMapType);
    }
    enterYearProperty(context) {
        this.validateContext(context, MetaEdGrammar.RULE_YearProperty);
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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValidatorListener;
//# sourceMappingURL=ValidatorListener.js.map