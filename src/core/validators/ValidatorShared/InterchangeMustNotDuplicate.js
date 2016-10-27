// @flow
import type SymbolTable from '../SymbolTable';
import { findDuplicates } from '../ValidationHelper';

// eslint-disable-next-line no-unused-vars
function valid(idsToCheck: (ruleContext: any) => string[], ruleContext: any, symbolTable: SymbolTable): boolean {
  return findDuplicates(idsToCheck(ruleContext)).length === 0;
}

/* eslint-disable no-unused-vars */
function failureMessage(entityTitle: string, duplicateItemName: string, identifierFinder: (ruleContext: any) => string,
                        idsToCheck: (ruleContext: any) => string[], ruleContext: any, symbolTable: SymbolTable): string {
  const identifier = identifierFinder(ruleContext);
  const duplicates = findDuplicates(idsToCheck(ruleContext));
  const joinString = '\', \'';
  return `${entityTitle} '${identifier}' declares duplicate ${duplicateItemName}${duplicates.length > 1 ? 's' : ''} '${duplicates.join(joinString)}'.`;
}

