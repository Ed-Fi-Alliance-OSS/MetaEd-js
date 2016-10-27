// @flow
import type SymbolTable from '../SymbolTable';
import { includePropertyErrorRule, includeIncludePropertyRule } from './IncludePropertyValidationRule';
import { topLevelEntityAncestorContext, propertyAncestorContext } from '../ValidationHelper';
import { entityIdentifier, entityName } from '../TopLevelEntityInformation';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.includeExtensionOverride() == null) return true;
  return symbolTable.identifierExists(SymbolTableEntityType.commonTypeExtension(), ruleContext.propertyName().getText());
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  const parentPropertyName = propertyAncestorContext(ruleContext).propertyName().ID().getText();
  return `'include extension' is invalid for property ${parentPropertyName} on ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}'.  'include extension' is only valid for referencing common type extensions.`;
}

const validationRule = includePropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeIncludePropertyRule(validationRule);
