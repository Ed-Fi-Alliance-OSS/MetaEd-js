import type SymbolTable from './SymbolTable';
import SymbolTableEntityType from './SymbolTableEntityType';

function commonSimpleTypeExists(identifierToMatch: string, symbolTable: SymbolTable): boolean {
  return symbolTable.identifierExists(SymbolTableEntityType.commonDecimalType(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.commonIntegerType(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.commonShortType(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.commonStringType(), identifierToMatch);
}

// eslint-disable-next-line import/prefer-default-export
export function propertyMustNotMatchACommonSimpleType(propertyRuleContext: any, symbolTable: SymbolTable): boolean {
  return !commonSimpleTypeExists(propertyRuleContext.propertyName().getText(), symbolTable);
}
