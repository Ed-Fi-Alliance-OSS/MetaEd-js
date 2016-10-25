// @flow
import type SymbolTable from '../SymbolTable';
import { domainItemErrorRule, includeDomainItemRule } from './DomainValidationRule';
import { contextMustMatchATopLevelEntity, topLevelEntityAncestorContext } from '../ValidationHelper';
import { entityIdentifier, entityName } from '../TopLevelEntityInformation';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const topLevelEntityContext = topLevelEntityAncestorContext(ruleContext);
  return `Domain item '${ruleContext.ID().getText()}' under ${entityIdentifier(topLevelEntityContext)} '${entityName(topLevelEntityContext)}' does not match any declared abstract entity, domain entity or subclass, association or subclass, or common type.`;
}

const validationRule = domainItemErrorRule(contextMustMatchATopLevelEntity, failureMessage);
export { validationRule as default };

export const includeRule = includeDomainItemRule(validationRule);
