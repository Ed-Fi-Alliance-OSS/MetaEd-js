// @flow
import type SymbolTable from '../SymbolTable';
import { parentIdentifierForPropertyContext, parentTypeNameForPropertyContext } from '../../../grammar/ParserRuleContextExtensions';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { valid } from '../CommonSimpleType/CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits';
  let invalidPath: ?string[] = exceptionPath(['decimalPlaces', 'UNSIGNED_INT'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['totalDigits', 'UNSIGNED_INT'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['propertyName'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Decimal Property '${ruleContext.propertyName().ID().getText()}' in ${parentTypeNameForPropertyContext(ruleContext)}` +
    ` '${parentIdentifierForPropertyContext(ruleContext)}' has decimal places greater than total digits.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_decimalProperty, validationRule);
