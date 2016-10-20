// @flow
import type SymbolTable from '../SymbolTable';
import { commonIntegerErrorRule, includeCommonIntegerRule } from './CommonSimpleTypeValidationRule';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.minValue() == null || ruleContext.maxValue() == null) return true;
  const minValue = Number.parseInt(ruleContext.minValue().MinValue(), 10);
  const maxValue = Number.parseInt(ruleContext.maxValue().MaxValue(), 10);
  return minValue <= maxValue;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Common Integer '${ruleContext.commonIntegerName().getText()}' has min value greater than max value.`;
}

const validationRule = commonIntegerErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeCommonIntegerRule(validationRule);
