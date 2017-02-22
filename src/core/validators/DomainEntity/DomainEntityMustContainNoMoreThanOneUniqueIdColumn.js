// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { namespaceAncestorContext, getProperty, exceptionPath, isExtensionNamespace, getPropertyThenPropertyName } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'AbstractEntityMustContainAnIdentity';
  let invalidPath: ?string[] = exceptionPath(['property'], ruleContext);

  if (invalidPath) return { invalidPath, validatorName };

  // eslint-disable-next-line no-restricted-syntax
  for (const property of ruleContext.property()) {
    const concreteProperty = getProperty(property);
    invalidPath = exceptionPath(['propertyName', 'ID'], concreteProperty);
    if (invalidPath) return { invalidPath, validatorName };
  }

  invalidPath = exceptionPath(['entityName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const namespaceContext = namespaceAncestorContext(ruleContext);
  return isExtensionNamespace(namespaceContext) || R.filter(x => getPropertyThenPropertyName(x) === 'UniqueId', ruleContext.property()).length <= 1;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Domain Entity ${ruleContext.entityName().ID().getText()} has multiple properties with a property name of 'UniqueId'.  Only one column in a core domain entity can be named 'UniqueId'.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainEntity, validationRule);
