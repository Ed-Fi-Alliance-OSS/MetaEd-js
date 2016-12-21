// @flow
import { getProperty, exceptionPath } from '../ValidationHelper';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
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

  invalidPath = exceptionPath(['abstractEntityName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return ruleContext.property().some(x => getProperty(x).propertyComponents().propertyAnnotation().identity() != null);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Abstract Entity ${ruleContext.abstractEntityName().ID().getText()} does not have an identity specified.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_abstractEntity, validationRule);
