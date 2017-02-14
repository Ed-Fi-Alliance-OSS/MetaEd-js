// @flow
import type SymbolTable from '../SymbolTable';
import { exceptionPath } from '../ValidationHelper';
import { parentIdentifierForPropertyContext, parentTypeNameForPropertyContext } from '../../../grammar/ParserRuleContextExtensions';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { valid } from '../SharedSimpleType/SharedDecimalMinValueMustNotBeGreaterThanMaxValue';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'CommonDecimalMinValueMustNotBeGreaterThanMaxValue';
  if (ruleContext.minValueDecimal() == null || ruleContext.maxValueDecimal() == null) return { validatorName };

  let invalidPath: ?string[] = exceptionPath(['minValueDecimal', 'decimalValue', 'signed_int'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['maxValueDecimal', 'decimalValue', 'signed_int'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['propertyName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Decimal Property '${ruleContext.propertyName().ID().getText()}' in ${parentTypeNameForPropertyContext(ruleContext)}` +
    ` '${parentIdentifierForPropertyContext(ruleContext)}' has min value greater than max value.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_decimalProperty, validationRule);
