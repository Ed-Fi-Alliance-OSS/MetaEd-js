// @flow
import type SymbolTable from '../SymbolTable';
import { domainErrorRule, includeDomainRule } from './DomainValidationRule';
import { contextMustMatchATopLevelEntity, topLevelEntityAncestorContext } from '../ValidationHelper'; 

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
  return string.Format("Domain item '{0}' under {1} '{2}' does not match any declared abstract entity, domain entity or subclass, association or subclass, or common type.", context.IdText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
  
  
  const identifierToMatch = ruleContext.propertyName().getText();
  return `Descriptor property '${identifierToMatch}' does not match any declared descriptor.`;
}

const validationRule = domainErrorRule(contextMustMatchATopLevelEntity, failureMessage);
export { validationRule as default };

export const includeRule = includeDomainRule(validationRule);
