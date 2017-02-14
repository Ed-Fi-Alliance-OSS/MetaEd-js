// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { exceptionPath } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'CommonPropertyMustMatchACommon';
  const invalidPath: ?string[] = exceptionPath(['propertyName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifierToMatch = ruleContext.propertyName().ID().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.common(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.inlineCommon(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.choice(), identifierToMatch);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Include property '${ruleContext.propertyName().ID().getText()}' does not match any declared common type, inline common type, or choice type.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_commonProperty, validationRule);
