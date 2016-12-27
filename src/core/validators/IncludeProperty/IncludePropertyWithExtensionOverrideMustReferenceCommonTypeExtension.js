// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { topLevelEntityAncestorContext, propertyAncestorContext } from '../ValidationHelper';
import { entityIdentifier, entityName } from '../RuleInformation';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.includeExtensionOverride() == null) return true;
  return symbolTable.identifierExists(SymbolTableEntityType.commonTypeExtension(), ruleContext.propertyName().ID().getText());
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  const parentPropertyName = propertyAncestorContext(ruleContext).propertyName().ID().getText();
  return `'include extension' is invalid for property ${parentPropertyName} on ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}'.  'include extension' is only valid for referencing common type extensions.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_includeProperty, validationRule);
