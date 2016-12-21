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
    const invalidPath: ?string[] = exceptionPath(['propertyName', 'ID'], ruleContext);
    if (invalidPath) return { invalidPath, validatorName };

    return { validatorName };
  });

export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifierToMatch = ruleContext.propertyName().ID().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.domainEntity(), identifierToMatch)
    || symbolTable.identifierExists(SymbolTableEntityType.abstractEntity(), identifierToMatch)
    || symbolTable.identifierExists(SymbolTableEntityType.domainEntitySubclass(), identifierToMatch);
}

// eslint-disable-next-line no-unused-vars
export function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Domain Entity property '${ruleContext.propertyName().ID().getText()}' does not match any declared domain or abstract entity.`;
}

const validationRule = errorRuleBase(validatable('FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity'), valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_firstDomainEntity, validationRule);
