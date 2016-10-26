// @flow
import type SymbolTable from '../SymbolTable';
import { descriptorPropertyErrorRule, includeDescriptorPropertyRule } from './DescriptorPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return symbolTable.identifierExists(SymbolTableEntityType.descriptorEntity(), ruleContext.propertyName().getText());
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Descriptor property '${ruleContext.propertyName().getText()}' does not match any declared descriptor.`;
}

const validationRule = descriptorPropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeDescriptorPropertyRule(validationRule);
