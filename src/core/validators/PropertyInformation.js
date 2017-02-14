// @flow
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';

// eslint-disable-next-line import/prefer-default-export
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
  MetaEdGrammar.RULE_inlineCommonProperty,
  MetaEdGrammar.RULE_integerProperty,
  MetaEdGrammar.RULE_percentProperty,
  MetaEdGrammar.RULE_sharedDecimalProperty,
  MetaEdGrammar.RULE_sharedIntegerProperty,
  MetaEdGrammar.RULE_sharedShortProperty,
  MetaEdGrammar.RULE_sharedStringProperty,
  MetaEdGrammar.RULE_shortProperty,
  MetaEdGrammar.RULE_stringProperty,
  MetaEdGrammar.RULE_timeProperty,
  MetaEdGrammar.RULE_yearProperty,
];
