// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBaseForMultiRuleIndexes } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { exceptionPath } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract';
  const invalidPath: ?string[] = exceptionPath(['propertyName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifierToMatch = ruleContext.propertyName().ID().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.abstractEntity(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.association(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.associationSubclass(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.domainEntity(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.domainEntitySubclass(), identifierToMatch);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Reference property '${ruleContext.propertyName().ID().getText()}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBaseForMultiRuleIndexes([MetaEdGrammar.RULE_domainEntityProperty, MetaEdGrammar.RULE_associationProperty], validationRule);
