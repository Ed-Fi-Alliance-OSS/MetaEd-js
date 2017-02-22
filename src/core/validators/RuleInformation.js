// @flow
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';

export const topLevelEntityRules: number[] = [
  MetaEdGrammar.RULE_abstractEntity,
  MetaEdGrammar.RULE_association,
  MetaEdGrammar.RULE_associationExtension,
  MetaEdGrammar.RULE_associationSubclass,
  MetaEdGrammar.RULE_choice,
  MetaEdGrammar.RULE_sharedDecimal,
  MetaEdGrammar.RULE_sharedInteger,
  MetaEdGrammar.RULE_sharedShort,
  MetaEdGrammar.RULE_sharedString,
  MetaEdGrammar.RULE_common,
  MetaEdGrammar.RULE_commonExtension,
  MetaEdGrammar.RULE_descriptor,
  MetaEdGrammar.RULE_domain,
  MetaEdGrammar.RULE_domainEntity,
  MetaEdGrammar.RULE_domainEntityExtension,
  MetaEdGrammar.RULE_domainEntitySubclass,
  MetaEdGrammar.RULE_enumeration,
  MetaEdGrammar.RULE_inlineCommon,
  MetaEdGrammar.RULE_interchange,
  MetaEdGrammar.RULE_interchangeExtension,
  MetaEdGrammar.RULE_subdomain,
];

export const topLevelEntityExtensionRules: number[] = [
  MetaEdGrammar.RULE_associationExtension,
  MetaEdGrammar.RULE_commonExtension,
  MetaEdGrammar.RULE_domainEntityExtension,
  MetaEdGrammar.RULE_interchangeExtension,
];

export const propertyRules: number[] = [
  MetaEdGrammar.RULE_associationProperty,
  MetaEdGrammar.RULE_booleanProperty,
  MetaEdGrammar.RULE_choiceProperty,
  MetaEdGrammar.RULE_commonProperty,
  MetaEdGrammar.RULE_currencyProperty,
  MetaEdGrammar.RULE_dateProperty,
  MetaEdGrammar.RULE_decimalProperty,
  MetaEdGrammar.RULE_descriptorProperty,
  MetaEdGrammar.RULE_domainEntityProperty,
  MetaEdGrammar.RULE_durationProperty,
  MetaEdGrammar.RULE_enumerationProperty,
  MetaEdGrammar.RULE_firstDomainEntity,
  MetaEdGrammar.RULE_inlineCommonProperty,
  MetaEdGrammar.RULE_integerProperty,
  MetaEdGrammar.RULE_percentProperty,
  MetaEdGrammar.RULE_secondDomainEntity,
  MetaEdGrammar.RULE_sharedDecimalProperty,
  MetaEdGrammar.RULE_sharedIntegerProperty,
  MetaEdGrammar.RULE_sharedShortProperty,
  MetaEdGrammar.RULE_sharedStringProperty,
  MetaEdGrammar.RULE_shortProperty,
  MetaEdGrammar.RULE_stringProperty,
  MetaEdGrammar.RULE_timeProperty,
  MetaEdGrammar.RULE_yearProperty,
];

export const itemRules: number[] = [
  MetaEdGrammar.RULE_domainItem,
  MetaEdGrammar.RULE_enumerationItem,
  MetaEdGrammar.RULE_interchangeElement,
  MetaEdGrammar.RULE_interchangeIdentity,
];
