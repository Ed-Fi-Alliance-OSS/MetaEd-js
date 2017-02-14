// @flow
import { exceptionPath } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'CommonStringMinLengthMustNotBeGreaterThanMaxLength';
  if (ruleContext.minLength() == null) return { validatorName };

  let invalidPath: ?string[] = exceptionPath(['minLength', 'UNSIGNED_INT'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['maxLength', 'UNSIGNED_INT'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['sharedStringName'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.minLength() == null) return true;
  const minLength = Number.parseInt(ruleContext.minLength().UNSIGNED_INT().getText(), 10);
  const maxLength = Number.parseInt(ruleContext.maxLength().UNSIGNED_INT().getText(), 10);
  return minLength <= maxLength;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Common String '${ruleContext.sharedStringName().getText()}' has min length greater than max length.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_sharedString, validationRule);
