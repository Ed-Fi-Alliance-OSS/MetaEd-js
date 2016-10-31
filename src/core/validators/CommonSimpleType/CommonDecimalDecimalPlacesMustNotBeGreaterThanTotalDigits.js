// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const decimalPlaces: number = Number.parseInt(ruleContext.decimalPlaces().UNSIGNED_INT().getText(), 10);
  const totalDigits: number = Number.parseInt(ruleContext.totalDigits().UNSIGNED_INT().getText(), 10);
  return decimalPlaces <= totalDigits;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Common Decimal '${ruleContext.commonDecimalName().getText()} has decimal places greater than total digits.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_commonDecimal, validationRule);
