// @flow
import {MetaEdGrammar} from '../../../src/grammar/gen/MetaEdGrammar';
import {MetaEdGrammarListener} from '../../../src/grammar/gen/MetaEdGrammarListener';
import {MetaEdContext} from '../tasks/MetaEdContext';
import {MetaEdFileIndex} from '../../grammar/IMetaEdFileIndex';
import type SymbolTable from './SymbolTable';
import {ValidationMessage} from '../../common/ValidationMessage';
import type { ValidationRuleRepository } from './ValidationRuleRepository';
import ValidationLevel from "./ValidationLevel";

export default class ValidatorListener extends MetaEdGrammarListener {
    validationRuleRepository: ValidationRuleRepository;
    symbolTable: SymbolTable;
    warningMessageCollection: ValidationMessage[];
    errorMessageCollection: ValidationMessage[];
    metaEdFileIndex: MetaEdFileIndex;

    constructor(validationRuleRepository: ValidationRuleRepository) {
        super();
        this.validationRuleRepository = validationRuleRepository;
    }

    withContext(metaEdContext: MetaEdContext) {
        this.metaEdFileIndex = metaEdContext.metaEdFileIndex;
        this.warningMessageCollection = metaEdContext.warningMessageCollection;
        this.errorMessageCollection = metaEdContext.errorMessageCollection;
        this.symbolTable = metaEdContext.symbolTable;
    }

    _validateContext(ruleContext: any, ruleIndex: number) {
        const relevantRules = this.validationRuleRepository.get(ruleIndex);
        if (relevantRules == null) return;
        
        const validationResults = relevantRules.map(validationRule => validationRule(ruleContext, this.symbolTable));

        validationResults.filter(x => x.errorLevel == ValidationLevel.Error && !x.valid)
            .forEach(y => this.errorMessageCollection.push(this._buildValidationMessage(y.failureMessage, ruleContext)));

        validationResults.filter(x => x.errorLevel == ValidationLevel.Warning && !x.valid)
            .forEach(y => this.warningMessageCollection.push(this._buildValidationMessage(y.failureMessage, ruleContext)));
    }

    _buildValidationMessage(failureMessage: ?string, context: any): ValidationMessage {
        const metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(context.start.line);
        return {
            message: failureMessage == null ? "ERROR: Failure, but no failure message provided" : failureMessage,
            characterPosition: context.start.column,
            concatenatedLineNumber: context.start.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
    }

    enterAbstractEntity(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_abstractEntity);
    }

    enterAbstractEntityName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_abstractEntityName);
    }

    enterAssociation(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_association);
    }

    enterAssociationExtension(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_associationExtension);
    }

    enterAssociationName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_associationName);
    }

    enterAssociationSubclass(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_associationSubclass);
    }

    enterBaseKeyName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_baseKeyName);
    }

    enterBaseName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_baseName);
    }

    enterBooleanProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_booleanProperty);
    }

    enterCascadeUpdate(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_cascadeUpdate);
    }

    enterChoiceName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_choiceName);
    }

    enterChoiceType(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_choiceType);
    }

    enterCollection(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_collection);
    }

    enterCommonDecimalName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_commonDecimalName);
    }

    enterCommonDecimal(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_commonDecimal);
    }

    enterCommonIntegerName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_commonIntegerName);
    }

    enterCommonInteger(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_commonInteger);
    }

    enterCommonShortName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_commonShortName);
    }

    enterCommonShort(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_commonShort);
    }

    enterCommonStringName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_commonStringName);
    }

    enterCommonString(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_commonString);
    }

    enterCommonName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_commonName);
    }

    enterCommonType(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_commonType);
    }

    enterCommonTypeExtension(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_commonTypeExtension);
    }

    enterCurrencyProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_currencyProperty);
    }

    enterDateProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_dateProperty);
    }

    enterDecimalPlaces(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_decimalPlaces);
    }

    enterDecimalProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_decimalProperty);
    }

    enterDecimalValue(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_decimalValue);
    }

    enterDescriptor(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_descriptor);
    }

    enterDescriptorName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_descriptorName);
    }

    enterDescriptorProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_descriptorProperty);
    }

    enterDocumentation(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_documentation);
    }

    enterFooterDocumentation(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_footerDocumentation);
    }

    enterExtendedDocumentation(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_extendedDocumentation);
    }

    enterUseCaseDocumentation(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_useCaseDocumentation);
    }

    enterDocumentationLine(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_documentationLine);
    }

    enterDomain(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_domain);
    }

    enterDomainItem(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_domainItem);
    }

    enterDomainName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_domainName);
    }

    enterDomainEntity(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_domainEntity);
    }

    enterDomainEntityExtension(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_domainEntityExtension);
    }

    enterDomainEntitySubclass(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_domainEntitySubclass);
    }

    enterDurationProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_durationProperty);
    }

    enterEntityConfiguration(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_entityConfiguration);
    }

    enterEntityName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_entityName);
    }

    enterEnumeration(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_enumeration);
    }

    enterEnumerationName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_enumerationName);
    }

    enterEnumerationProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_enumerationProperty);
    }

    enterExtendeeName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_extendeeName);
    }

    enterFirstDomainEntity(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_firstDomainEntity);
    }

    enterIncludeProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_includeProperty);
    }

    enterIncludeExtensionOverride(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_includeExtensionOverride);
    }

    enterInlineCommonName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_inlineCommonName);
    }

    enterInlineCommonType(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_inlineCommonType);
    }

    enterSigned_int(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_signed_int);
    }

    enterIntegerProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_integerProperty);
    }

    enterInterchange(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_interchange);
    }

    enterInterchangeComponent(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_interchangeComponent);
    }

    enterInterchangeElement(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_interchangeElement);
    }

    enterInterchangeExtension(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_interchangeExtension);
    }

    enterInterchangeExtensionComponent(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_interchangeExtensionComponent);
    }

    enterInterchangeIdentityTemplate(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_interchangeIdentityTemplate);
    }

    enterInterchangeName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_interchangeName);
    }

    enterEnumerationItem(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_enumerationItem);
    }

    enterMaxLength(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_maxLength);
    }

    enterMaxValue(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_maxValue);
    }

    enterMaxValueDecimal(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_maxValueDecimal);
    }

    enterIsWeakReference(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_isWeakReference);
    }

    enterMergePartOfReference(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_mergePartOfReference);
    }

    enterMergePropertyPath(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_mergePropertyPath);
    }

    enterMetaEd(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_metaEd);
    }

    enterMinLength(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_minLength);
    }

    enterMinValue(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_minValue);
    }

    enterMinValueDecimal(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_minValueDecimal);
    }

    enterNamespace(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_namespace);
    }

    enterNamespaceName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_namespaceName);
    }

    enterNamespaceType(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_namespaceType);
    }

    enterNamespaceProjectExtension(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_namespaceProjectExtension);
    }

    enterOptional(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_optional);
    }

    enterOptionalCollection(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_optionalCollection);
    }

    enterOptionalMapType(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_optionalMapType);
    }

    enterPercentProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_percentProperty);
    }

    enterIdentity(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_identity);
    }

    enterIdentityRename(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_identityRename);
    }

    enterMetaEdId(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_metaEdId);
    }

    enterProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_property);
    }

    enterPropertyAnnotation(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_propertyAnnotation);
    }

    enterPropertyComponents(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_propertyComponents);
    }

    enterPropertyName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_propertyName);
    }

    enterPropertyPath(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_propertyPath);
    }

    enterReferenceProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_referenceProperty);
    }

    enterRequired(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_required);
    }

    enterRequiredCollection(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_requiredCollection);
    }

    enterRequiredMapType(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_requiredMapType);
    }

    enterSecondDomainEntity(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_secondDomainEntity);
    }

    enterShortDescription(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_shortDescription);
    }

    enterSharedDecimalProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_sharedDecimalProperty);
    }

    enterSharedIntegerProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_sharedIntegerProperty);
    }

    enterSharedShortProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_sharedShortProperty);
    }

    enterSharedStringProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_sharedStringProperty);
    }

    enterSharedPropertyType(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_sharedPropertyType);
    }

    enterShortenToName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_shortenToName);
    }

    enterShortProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_shortProperty);
    }

    enterStringProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_stringProperty);
    }

    enterSubdomain(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_subdomain);
    }

    enterParentDomainName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_parentDomainName);
    }

    enterSubdomainName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_subdomainName);
    }

    enterSubdomainPosition(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_subdomainPosition);
    }

    enterTargetPropertyPath(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_targetPropertyPath);
    }

    enterTimeProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_timeProperty);
    }

    enterTopLevelEntity(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_topLevelEntity);
    }

    enterTotalDigits(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_totalDigits);
    }

    enterUnaryOperator(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_unaryOperator);
    }

    enterIsQueryableField(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_isQueryableField);
    }

    enterIsQueryableOnly(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_isQueryableOnly);
    }

    enterWithContext(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_withContext);
    }

    enterWithContextName(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_withContextName);
    }

    enterWithMapType(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_withMapType);
    }

    enterYearProperty(context: any) {
        this._validateContext(context, MetaEdGrammar.RULE_yearProperty);
    }

    exitAbstractEntity(context: any) {
    }

    exitAbstractEntityName(context: any) {
    }

    exitAssociation(context: any) {
    }

    exitAssociationExtension(context: any) {
    }

    exitAssociationName(context: any) {
    }

    exitAssociationSubclass(context: any) {
    }

    exitBaseKeyName(context: any) {
    }

    exitBaseName(context: any) {
    }

    exitBooleanProperty(context: any) {
    }

    exitCascadeUpdate(context: any) {
    }

    exitChoiceName(context: any) {
    }

    exitChoiceType(context: any) {
    }

    exitCollection(context: any) {
    }

    exitCommonDecimalName(context: any) {
    }

    exitCommonDecimal(context: any) {
    }

    exitCommonIntegerName(context: any) {
    }

    exitCommonInteger(context: any) {
    }

    exitCommonShortName(context: any) {
    }

    exitCommonShort(context: any) {
    }

    exitCommonStringName(context: any) {
    }

    exitCommonString(context: any) {
    }

    exitCommonName(context: any) {
    }

    exitCommonType(context: any) {
    }

    exitCommonTypeExtension(context: any) {
    }

    exitCurrencyProperty(context: any) {
    }

    exitDateProperty(context: any) {
    }

    exitDecimalPlaces(context: any) {
    }

    exitDecimalProperty(context: any) {
    }

    exitDecimalValue(context: any) {
    }

    exitDescriptor(context: any) {
    }

    exitDescriptorName(context: any) {
    }

    exitDescriptorProperty(context: any) {
    }

    exitDocumentation(context: any) {
    }

    exitFooterDocumentation(context: any) {
    }

    exitExtendedDocumentation(context: any) {
    }

    exitUseCaseDocumentation(context: any) {
    }

    exitDocumentationLine(context: any) {
    }

    exitDomain(context: any) {
    }

    exitDomainItem(context: any) {
    }

    exitDomainName(context: any) {
    }

    exitDomainEntity(context: any) {
    }

    exitDomainEntityExtension(context: any) {
    }

    exitDomainEntitySubclass(context: any) {
    }

    exitDurationProperty(context: any) {
    }

    exitEntityConfiguration(context: any) {
    }

    exitEntityName(context: any) {
    }

    exitEnumeration(context: any) {
    }

    exitEnumerationName(context: any) {
    }

    exitEnumerationProperty(context: any) {
    }

    exitExtendeeName(context: any) {
    }

    exitFirstDomainEntity(context: any) {
    }

    exitIncludeProperty(context: any) {
    }

    exitIncludeExtensionOverride(context: any) {
    }

    exitInlineCommonName(context: any) {
    }

    exitInlineCommonType(context: any) {
    }

    exitSigned_int(context: any) {
    }

    exitIntegerProperty(context: any) {
    }

    exitInterchange(context: any) {
    }

    exitInterchangeComponent(context: any) {
    }

    exitInterchangeElement(context: any) {
    }

    exitInterchangeExtension(context: any) {
    }

    exitInterchangeExtensionComponent(context: any) {
    }

    exitInterchangeIdentityTemplate(context: any) {
    }

    exitInterchangeName(context: any) {
    }

    exitEnumerationItem(context: any) {
    }

    exitMaxLength(context: any) {
    }

    exitMaxValue(context: any) {
    }

    exitMaxValueDecimal(context: any) {
    }

    exitIsWeakReference(context: any) {
    }

    exitMergePartOfReference(context: any) {
    }

    exitMergePropertyPath(context: any) {
    }

    exitMetaEd(context: any) {
    }

    exitMinLength(context: any) {
    }

    exitMinValue(context: any) {
    }

    exitMinValueDecimal(context: any) {
    }

    exitNamespace(context: any) {
    }

    exitNamespaceName(context: any) {
    }

    exitNamespaceType(context: any) {
    }

    exitNamespaceProjectExtension(context: any) {
    }

    exitOptional(context: any) {
    }

    exitOptionalCollection(context: any) {
    }

    exitOptionalMapType(context: any) {
    }

    exitPercentProperty(context: any) {
    }

    exitIdentity(context: any) {
    }

    exitIdentityRename(context: any) {
    }

    exitMetaEdId(context: any) {
    }

    exitProperty(context: any) {
    }

    exitPropertyAnnotation(context: any) {
    }

    exitPropertyComponents(context: any) {
    }

    exitPropertyName(context: any) {
    }

    exitPropertyPath(context: any) {
    }

    exitReferenceProperty(context: any) {
    }

    exitRequired(context: any) {
    }

    exitRequiredCollection(context: any) {
    }

    exitRequiredMapType(context: any) {
    }

    exitSecondDomainEntity(context: any) {
    }

    exitSharedDecimalProperty(context: any) {
    }

    exitSharedIntegerProperty(context: any) {
    }

    exitSharedShortProperty(context: any) {
    }

    exitSharedStringProperty(context: any) {
    }

    exitSharedPropertyType(context: any) {
    }

    exitShortDescription(context: any) {
    }

    exitShortenToName(context: any) {
    }

    exitShortProperty(context: any) {
    }

    exitStringProperty(context: any) {
    }

    exitSubdomain(context: any) {
    }

    exitParentDomainName(context: any) {
    }

    exitSubdomainName(context: any) {
    }

    exitSubdomainPosition(context: any) {
    }

    exitTargetPropertyPath(context: any) {
    }

    exitTimeProperty(context: any) {
    }

    exitTopLevelEntity(context: any) {
    }

    exitTotalDigits(context: any) {
    }

    exitUnaryOperator(context: any) {
    }

    exitIsQueryableField(context: any) {
    }

    exitIsQueryableOnly(context: any) {
    }

    exitWithContext(context: any) {
    }

    exitWithContextName(context: any) {
    }

    exitWithMapType(context: any) {
    }

    exitYearProperty(context: any) {
    }
}