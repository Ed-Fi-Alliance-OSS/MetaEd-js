// @flow
import type SymbolTable from '../SymbolTable';
import { descriptorPropertyErrorRule, includeDescriptorPropertyRule } from './DescriptorPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifierToMatch = ruleContext.propertyName().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.descriptorEntity(), identifierToMatch);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const identifierToMatch = ruleContext.propertyName().getText();
  return `Descriptor property '${identifierToMatch}' does not match any declared descriptor.`;
}

const validationRule = descriptorPropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeDescriptorPropertyRule(validationRule);
