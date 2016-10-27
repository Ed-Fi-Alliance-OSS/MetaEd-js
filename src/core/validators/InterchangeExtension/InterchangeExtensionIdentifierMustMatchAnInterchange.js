// @flow
import type SymbolTable from '../SymbolTable';
import { interchangeExtensionErrorRule, includeInterchangeExtensionRule } from './InterchangeExtensionValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return symbolTable.identifierExists(SymbolTableEntityType.interchange(), ruleContext.extendeeName().getText());
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Interchange additions '${ruleContext.extendeeName().getText()}' does not match any declared Interchange.`;
}

const validationRule = interchangeExtensionErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeInterchangeExtensionRule(validationRule);
