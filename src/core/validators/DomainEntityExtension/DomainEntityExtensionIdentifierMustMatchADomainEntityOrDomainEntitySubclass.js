// @flow
import { domainEntityExtensionErrorRule, includeDomainEntityExtensionRule } from './DomainEntityExtensionValidationRule';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
  const identifierToMatch = ruleContext.extendeeName().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.domainEntity(), identifierToMatch)
    || symbolTable.identifierExists(SymbolTableEntityType.domainEntitySubclass(), identifierToMatch);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
  return `Domain Entity additions '${ruleContext.extendeeName().getText()}' does not match any declared Domain Entity or subclass.`;
}

const validationRule = domainEntityExtensionErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeDomainEntityExtensionRule(validationRule);
