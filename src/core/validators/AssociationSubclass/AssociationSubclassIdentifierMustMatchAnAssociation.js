// @flow
import R from 'ramda';
import { exceptionPath } from '../ValidationHelper';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';
import type { ValidatableResult } from '../ValidationTypes';

export const validatable = R.curry(
  (validatorName: string, ruleContext: any): ValidatableResult => {
    const invalidPath: ?string[] = exceptionPath(['baseName'], ruleContext);
    if (invalidPath) return { invalidPath, validatorName };

    return { validatorName };
  });

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const basedOnName = ruleContext.baseName().getText();
  return Array.from(symbolTable.identifiersForEntityType(SymbolTableEntityType.association())).some(x => x === basedOnName);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Association '${ruleContext.associationName().getText()}' based on '${ruleContext.baseName().getText()}' does not match any declared Association.`;
}

const validationRule = errorRuleBase(validatable('AssociationSubclassIdentifierMustMatchAnAssociation'), valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_associationSubclass, validationRule);
