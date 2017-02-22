// @flow
import type SymbolTable from '../SymbolTable';
import { topLevelEntityAncestorContext,
  contextMustMatchATopLevelEntity,
  exceptionPath,
  entityNameExceptionPath,
  entityIdentifierExceptionPath,
  entityIdentifier,
  entityName } from '../ValidationHelper';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'DomainItemMustMatchTopLevelEntity';
  let invalidPath: ?string[] = exceptionPath(['ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  const parentEntityContext = topLevelEntityAncestorContext(ruleContext);
  invalidPath = entityNameExceptionPath(parentEntityContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = entityIdentifierExceptionPath(parentEntityContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const topLevelEntityContext = topLevelEntityAncestorContext(ruleContext);
  return `Domain item '${ruleContext.ID().getText()}' under ${entityIdentifier(topLevelEntityContext)} '${entityName(topLevelEntityContext)}' does not match any declared abstract entity, domain entity or subclass, association or subclass, or common type.`;
}

const validationRule = errorRuleBase(validatable, contextMustMatchATopLevelEntity, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainItem, validationRule);
