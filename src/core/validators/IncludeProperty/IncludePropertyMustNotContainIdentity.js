// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { topLevelEntityAncestorContext, exceptionPath, entityNameExceptionPath, entityIdentifierExceptionPath } from '../ValidationHelper';
import { entityIdentifier, entityName } from '../RuleInformation';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'IdentityRenameExistsOnlyIfIdentityRenameIsAllowed';

  let invalidPath: ?string[] = exceptionPath(['propertyComponents', 'propertyAnnotation', 'identity'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['propertyName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  const parentEntityContext = topLevelEntityAncestorContext(ruleContext);
  invalidPath = entityNameExceptionPath(parentEntityContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = entityIdentifierExceptionPath(parentEntityContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return ruleContext.propertyComponents().propertyAnnotation().identity() == null;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  return `Include property '${ruleContext.propertyName().ID().getText()}' is invalid to be used for the identity of ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}'`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_includeProperty, validationRule);
