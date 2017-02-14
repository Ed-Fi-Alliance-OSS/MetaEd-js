// @flow
import { exceptionPath } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'CommonIntegerMinValueMustNotBeGreaterThanMaxValue';
  if (ruleContext.minValue() == null || ruleContext.maxValue() == null) return { validatorName };

  let invalidPath: ?string[] = exceptionPath(['minValue', 'signed_int'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['maxValue', 'signed_int'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['sharedIntegerName'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.minValue() == null || ruleContext.maxValue() == null) return true;
  const minValue = Number.parseInt(ruleContext.minValue().signed_int().getText(), 10);
  const maxValue = Number.parseInt(ruleContext.maxValue().signed_int().getText(), 10);
  return minValue <= maxValue;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Common Integer '${ruleContext.sharedIntegerName().getText()}' has min value greater than max value.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_sharedInteger, validationRule);
