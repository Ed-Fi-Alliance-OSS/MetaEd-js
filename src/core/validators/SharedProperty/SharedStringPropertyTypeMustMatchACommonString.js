// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import { validForShared, failureMessageForShared } from './SharedPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

const validationRule = errorRuleBase(validForShared(SymbolTableEntityType.commonString()), failureMessageForShared('common string'));
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_sharedStringProperty, validationRule);
