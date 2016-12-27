// @flow
import { getProperty, exceptionPath } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { valid } from '../AbstractEntity/AbstractEntityMustContainAnIdentity';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'AbstractEntityMustContainAnIdentity';
  let invalidPath: ?string[] = exceptionPath(['property'], ruleContext);

  if (invalidPath) return { invalidPath, validatorName };

  // eslint-disable-next-line no-restricted-syntax
  for (const property of ruleContext.property()) {
    const concreteProperty = getProperty(property);
    invalidPath = exceptionPath(['propertyComponents', 'propertyAnnotation'], concreteProperty);
    if (invalidPath) return { invalidPath, validatorName };
  }

  invalidPath = exceptionPath(['entityName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Domain Entity ${ruleContext.entityName().ID().getText()} does not have an identity specified.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainEntity, validationRule);
