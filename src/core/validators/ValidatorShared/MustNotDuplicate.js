// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';
import { findDuplicates } from '../ValidationHelper';

/* eslint-disable no-unused-vars */
export const validForDuplicates = R.curry(
  (idsToCheck: (ruleContext: any) => string[], ruleContext: any, symbolTable: SymbolTable): boolean =>
  findDuplicates(idsToCheck(ruleContext)).length === 0);


/* eslint-disable no-unused-vars */
export const failureMessageForDuplicates = R.curry(
  (entityTitle: string, duplicateItemName: string, identifierFinder: (ruleContext: any) => string,
                        idsToCheck: (ruleContext: any) => string[], ruleContext: any, symbolTable: SymbolTable): string => {
    const identifier = identifierFinder(ruleContext);
    const duplicates = findDuplicates(idsToCheck(ruleContext));
    const joinString = '\', \'';
    return `${entityTitle} '${identifier}' declares duplicate ${duplicateItemName}${duplicates.length > 1 ? 's' : ''} '${duplicates.join(joinString)}'.`;
  });

