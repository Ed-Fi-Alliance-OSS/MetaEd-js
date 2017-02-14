// @flow
import { exceptionPath } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'CommonDecimalMinValueMustNotBeGreaterThanMaxValue';
  if (ruleContext.minValueDecimal() == null || ruleContext.maxValueDecimal() == null) return { validatorName };

  let invalidPath: ?string[] = exceptionPath(['minValueDecimal', 'decimalValue', 'signed_int'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['maxValueDecimal', 'decimalValue', 'signed_int'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['sharedDecimalName'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.minValueDecimal() == null || ruleContext.maxValueDecimal() == null) return true;
  const minValue = Number.parseInt(ruleContext.minValueDecimal().decimalValue().signed_int().getText(), 10);
  const maxValue = Number.parseInt(ruleContext.maxValueDecimal().decimalValue().signed_int().getText(), 10);
  return minValue <= maxValue;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Common Decimal '${ruleContext.sharedDecimalName().getText()}' has min value greater than max value.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_sharedDecimal, validationRule);
