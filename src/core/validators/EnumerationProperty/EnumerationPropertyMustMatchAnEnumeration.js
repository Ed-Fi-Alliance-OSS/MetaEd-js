// @flow
import type SymbolTable from '../SymbolTable';
import { enumerationPropertyErrorRule, includeEnumerationPropertyRule } from './EnumerationPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return symbolTable.identifierExists(SymbolTableEntityType.enumeration(), ruleContext.propertyName().getText());
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Enumeration property '${ruleContext.propertyName().getText()}' does not match any declared enumeration.`;
}

const validationRule = enumerationPropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeEnumerationPropertyRule(validationRule);
