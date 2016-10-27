// @flow
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import { identityRenameErrorRule, includeIdentityRenameRule } from './IdentityRenameValidationRule';
import { topLevelEntityAncestorContext, propertyAncestorContext } from '../ValidationHelper';
import { entityIdentifier, entityName } from '../TopLevelEntityInformation';

const validIdentityRenameParentRuleIndices: number[] = [
  MetaEdGrammar.RULE_domainEntitySubclass,
  MetaEdGrammar.RULE_associationSubclass,
];

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

const validationRule = identityRenameErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeIdentityRenameRule(validationRule);
