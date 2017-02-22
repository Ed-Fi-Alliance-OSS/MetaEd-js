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
import { } from '../RuleInformation';
import SymbolTableEntityType from '../SymbolTableEntityType';
import type { ValidatableResult } from '../ValidationTypes';

const validIdentityRuleIndices: number[] = [
  MetaEdGrammar.RULE_abstractEntity,
  MetaEdGrammar.RULE_association,
  MetaEdGrammar.RULE_common,
  MetaEdGrammar.RULE_domainEntity,
  MetaEdGrammar.RULE_inlineCommon,
];

const validIdentityTokenNames: string[] = [
  SymbolTableEntityType.abstractEntity(),
  SymbolTableEntityType.association(),
  SymbolTableEntityType.common(),
  SymbolTableEntityType.domainEntity(),
  SymbolTableEntityType.inlineCommon(),
];

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'IdentityExistsOnlyIfIdentityIsAllowed';

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
  return validIdentityRuleIndices.includes(parentEntity.ruleIndex);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  const parentPropertyName = propertyAncestorContext(ruleContext).propertyName().ID().getText();
  return `'is part of identity' is invalid for property ${parentPropertyName} ` +
    `on ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}'.  ` +
    `'is part of identity' is only valid for properties on types: ${validIdentityTokenNames.join(', ')}.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_identity, validationRule);
