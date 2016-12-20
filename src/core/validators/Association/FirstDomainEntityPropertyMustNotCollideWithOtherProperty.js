// @flow
import R from 'ramda';
import { exceptionPath } from '../ValidationHelper';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';
import type { ValidatableResult } from '../ValidationTypes';

export const validatable = R.curry(
  (validatorName: string, ruleContext: any): ValidatableResult => {
    let invalidPath: ?string[] = exceptionPath(['propertyName', 'ID'], ruleContext);
    if (invalidPath) return { invalidPath, validatorName };

    if (ruleContext.withContext()) {
      invalidPath = exceptionPath(['withContext', 'withContextName', 'ID'], ruleContext.withContext());
      if (invalidPath) return { invalidPath, validatorName };
    }

    invalidPath = exceptionPath(['associationName', 'ID'], ruleContext.parentCtx);
    if (invalidPath) return { invalidPath, validatorName };

    return { validatorName };
  });

export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifierToMatch = ruleContext.propertyName().ID().getText();
  const withContextContext = ruleContext.withContext();
  const withContextPrefix = withContextContext == null ? '' : withContextContext.withContextName().ID().getText();
  const associationName = ruleContext.parentCtx.associationName().ID().getText();
  const entitySymbolTable = symbolTable.get(SymbolTableEntityType.association(), associationName);
  if (entitySymbolTable == null) throw new Error('FirstDomainEntityPropertyMustNotCollideWithOtherProperty.valid(): Symbol table entry not found');
  return entitySymbolTable.propertySymbolTable.get(withContextPrefix + identifierToMatch) == null;
}

// eslint-disable-next-line no-unused-vars
export function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const associationName = ruleContext.parentCtx.associationName().ID().getText();
  return `Entity ${associationName} has duplicate properties named ${ruleContext.propertyName().ID().getText()}`;
}

const validationRule = errorRuleBase(validatable('FirstDomainEntityPropertyMustNotCollideWithOtherProperty'), valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_firstDomainEntity, validationRule);
