// @flow
import type SymbolTable from '../SymbolTable';
import { commonDecimalErrorRule, includeCommonDecimalRule } from './CommonSimpleTypeValidationRule';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const decimalPlaces: number = Number.parseInt(ruleContext.decimalPlaces().UNSIGNED_INT().getText(), 10);
  const totalDigits: number = Number.parseInt(ruleContext.totalDigits().UNSIGNED_INT().getText(), 10);
  return decimalPlaces <= totalDigits;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Common Decimal '${ruleContext.commonDecimalName().getText()} has decimal places greater than total digits.`;
}

const validationRule = commonDecimalErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeCommonDecimalRule(validationRule);
