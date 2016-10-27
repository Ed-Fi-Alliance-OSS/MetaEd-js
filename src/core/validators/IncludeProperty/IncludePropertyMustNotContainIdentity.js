// @flow
import type SymbolTable from '../SymbolTable';
import { includePropertyErrorRule, includeIncludePropertyRule } from './IncludePropertyValidationRule';
import { topLevelEntityAncestorContext } from '../ValidationHelper';
import { entityIdentifier, entityName } from '../TopLevelEntityInformation';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return ruleContext.propertyComponents().propertyAnnotation().identity() == null;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  return `Include property '${ruleContext.propertyName().getText()}' is invalid to be used for the identity of ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}'`;
}

const validationRule = includePropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeIncludePropertyRule(validationRule);
