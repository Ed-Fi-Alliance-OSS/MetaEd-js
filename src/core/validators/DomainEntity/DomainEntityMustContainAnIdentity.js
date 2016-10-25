// @flow
import type SymbolTable from '../SymbolTable';
import { domainEntityErrorRule, includeDomainEntityRule } from './DomainEntityValidationRule';
import { valid } from '../AbstractEntity/AbstractEntityMustContainAnIdentity';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Domain Entity ${ruleContext.entityName().ID().getText()} does not have an identity specified.`;
}

const validationRule = domainEntityErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeDomainEntityRule(validationRule);
