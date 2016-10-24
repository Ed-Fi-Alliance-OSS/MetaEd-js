// @flow
import { commonTypeExtensionErrorRule, includeCommonTypeExtensionRule } from './CommonTypeExtensionValidationRule';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifier = ruleContext.extendeeName().getText();
  return Array.from(symbolTable.identifiersForEntityType(SymbolTableEntityType.commonType())).some(x => x === identifier);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Common Type additions '${ruleContext.extendeeName().getText()}' does not match any declared Common Type.`;
}

const validationRule = commonTypeExtensionErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeCommonTypeExtensionRule(validationRule);
