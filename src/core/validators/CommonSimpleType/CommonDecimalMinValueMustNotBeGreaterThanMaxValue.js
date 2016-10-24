// @flow
import type SymbolTable from '../SymbolTable';
import { commonDecimalErrorRule, includeCommonDecimalRule } from './CommonSimpleTypeValidationRule';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.minValueDecimal() == null || ruleContext.maxValueDecimal() == null) return true;
  const minValue = Number.parseInt(ruleContext.minValueDecimal().decimalValue().signed_int().getText(), 10);
  const maxValue = Number.parseInt(ruleContext.maxValueDecimal().decimalValue().signed_int().getText(), 10);
  return minValue <= maxValue;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Common Decimal '${ruleContext.commonDecimalName().getText()}' has min value greater than max value.`;
}

const validationRule = commonDecimalErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeCommonDecimalRule(validationRule);
