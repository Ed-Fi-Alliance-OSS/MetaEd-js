// @flow
import type SymbolTable from '../SymbolTable';
import { commonStringErrorRule, includeCommonStringRule } from './CommonSimpleTypeValidationRule';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.minLength() == null) return true;
  const minLength = Number.parseInt(ruleContext.minLength().MinLength(), 10);
  const maxLength = Number.parseInt(ruleContext.maxLength().MaxLength(), 10);
  return minLength <= maxLength;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Common String '${ruleContext.commonStringName().getText()}' has min length greater than max length.`;
}

const validationRule = commonStringErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeCommonStringRule(validationRule);
