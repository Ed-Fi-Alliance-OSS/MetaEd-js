// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { propertyMustNotMatchACommonSimpleType } from '../ValidationHelper';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Decimal property '${ruleContext.propertyName().ID().getText()}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.`;
}

const validationRule = errorRuleBase(propertyMustNotMatchACommonSimpleType, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_decimalProperty, validationRule);
