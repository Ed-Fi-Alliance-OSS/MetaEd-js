// @flow
import { exceptionPath } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits';
  let invalidPath: ?string[] = exceptionPath(['decimalPlaces', 'UNSIGNED_INT'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['totalDigits', 'UNSIGNED_INT'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['sharedDecimalName'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const decimalPlaces: number = Number.parseInt(ruleContext.decimalPlaces().UNSIGNED_INT().getText(), 10);
  const totalDigits: number = Number.parseInt(ruleContext.totalDigits().UNSIGNED_INT().getText(), 10);
  return decimalPlaces <= totalDigits;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Common Decimal '${ruleContext.sharedDecimalName().getText()} has decimal places greater than total digits.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_sharedDecimal, validationRule);
