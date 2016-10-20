// @flow
import { associationSubclassErrorRule, includeAssociationSubclassRule } from './AssociationSubclassValidationRule';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
  const basedOnName = ruleContext.baseName().getText();
  return Array.from(symbolTable.identifiersForEntityType(SymbolTableEntityType.association())).some(x => x === basedOnName);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
  return `Association '${ruleContext.associationName().getText()}' based on '${ruleContext.baseName().getText()}' does not match any declared Association.`;
}

const validationRule = associationSubclassErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeAssociationSubclassRule(validationRule);

