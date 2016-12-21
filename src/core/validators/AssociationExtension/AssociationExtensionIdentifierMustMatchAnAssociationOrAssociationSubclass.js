// @flow
import R from 'ramda';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { exceptionPath } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

export const validatable = R.curry(
  (validatorName: string, ruleContext: any): ValidatableResult => {
    const invalidPath: ?string[] = exceptionPath(['extendeeName'], ruleContext);
    if (invalidPath) return { invalidPath, validatorName };

    return { validatorName };
  });

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifierToMatch = ruleContext.extendeeName().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.association(), identifierToMatch)
        || symbolTable.identifierExists(SymbolTableEntityType.associationSubclass(), identifierToMatch);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Association additions '${ruleContext.extendeeName().getText()}' does not match any declared Association or subclass.`;
}

const validationRule = errorRuleBase(validatable('AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass'), valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_associationExtension, validationRule);
