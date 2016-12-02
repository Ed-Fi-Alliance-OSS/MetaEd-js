// @flow
import { Map } from 'immutable';
import { MetaEdGrammar } from '../../../src/grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../../../src/grammar/gen/MetaEdGrammarListener';
import type { State } from '../State';
import type { ValidationRuleRepository } from './ValidationRuleRepository';

export default class ValidatorListener extends MetaEdGrammarListener {
  state: State;

  constructor(validationRuleRepository: ValidationRuleRepository) {
    super();
    this.validationRuleRepository = validationRuleRepository;
  }

  postValidationState(): State {
    return this.state;
  }

  withState(state: State) {
    this.state = state.set('validatorData', Map())
    .set('action', state.get('action').push('ValidatorListener'));
  }

  _validateContext(ruleContext: any, ruleIndex: number) {
    const relevantRules = this.validationRuleRepository.get(ruleIndex);
    if (relevantRules == null) return;
    relevantRules.forEach(validationRule => (this.state = validationRule(ruleContext, this.state)));
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

  // eslint-disable-next-line camelcase
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
}
