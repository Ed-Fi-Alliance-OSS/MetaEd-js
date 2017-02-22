// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { topLevelEntityAncestorContext,
  propertyAncestorContext,
  exceptionPath,
  entityNameExceptionPath,
  entityIdentifierExceptionPath,
  entityIdentifier,
  entityName } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

const validIdentityRenameParentRuleIndices: number[] = [
  MetaEdGrammar.RULE_domainEntitySubclass,
  MetaEdGrammar.RULE_associationSubclass,
];

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'IdentityRenameExistsOnlyIfIdentityRenameIsAllowed';

  let invalidPath: ?string[] = exceptionPath(['propertyName', 'ID'], propertyAncestorContext(ruleContext));
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
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  return validIdentityRenameParentRuleIndices.includes(parentEntity.ruleIndex);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  const parentPropertyName = propertyAncestorContext(ruleContext).propertyName().ID().getText();
  return `'renames identity property' is invalid for property ${parentPropertyName} on ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}'.  'renames identity property' is only valid for properties on Domain Entity subclass and Association subclass.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_identityRename, validationRule);
