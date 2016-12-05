// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { lookupParentEntityContext, propertyPathParts } from './MergePartOfReferenceValidationRule';
import type SymbolTable from '../SymbolTable';
import { validate, matchAllIdentityProperties } from './PropertyPathLookup';

export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  // first parent - mergePartOfReference
  // second parent - referenceProperty
  // third parent - property collection
  // fourth parent - Association/Extension/Subclass or DomainEntity/Extension/Subclass
  const entityContext = lookupParentEntityContext(symbolTable, ruleContext.parentCtx.parentCtx.parentCtx.parentCtx);

  if (entityContext == null) throw new Error('TargetPropertyPathMustExist.valid: entityContext not found');
  return validate(symbolTable, entityContext, propertyPathParts(ruleContext), matchAllIdentityProperties);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Path ${ruleContext.getText()} is not valid or lists properties that are not part of the primary key.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_targetPropertyPath, validationRule);
