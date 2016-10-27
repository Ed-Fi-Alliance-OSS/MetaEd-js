// @flow
import type SymbolTable from '../SymbolTable';
import { includeIncludePropertyRule, includePropertyErrorRule } from './IncludePropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifierToMatch = ruleContext.propertyName().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.commonType(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.inlineCommonType(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.choiceType(), identifierToMatch);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Include property '${ruleContext.propertyName().getText()}' does not match any declared common type, inline common type, or choice type.`;
}

const validationRule = includePropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeIncludePropertyRule(validationRule);
