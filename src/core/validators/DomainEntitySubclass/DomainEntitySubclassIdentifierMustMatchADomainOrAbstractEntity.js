// @flow
import { domainEntitySubclassErrorRule, includeDomainEntitySubclassRule } from './DomainEntitySubclassValidationRule';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
  const basedOnName = ruleContext.baseName().getText();
  return Array.from(symbolTable.identifiersForEntityType(SymbolTableEntityType.domainEntity())).some(x => x === basedOnName) ||
    Array.from(symbolTable.identifiersForEntityType(SymbolTableEntityType.abstractEntity())).some(x => x === basedOnName);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
  return `Domain Entity '${ruleContext.entityName().getText()}' based on '${ruleContext.baseName().getText()}' does not match any declared domain or abstract entity.`;
}

const validationRule = domainEntitySubclassErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeDomainEntitySubclassRule(validationRule);
