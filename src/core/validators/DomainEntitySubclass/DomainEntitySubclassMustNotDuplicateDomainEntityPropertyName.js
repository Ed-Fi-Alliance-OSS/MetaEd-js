// @flow
import { domainEntitySubclassErrorRule, includeDomainEntitySubclassRule } from './DomainEntitySubclassValidationRule';
import { valid, failureMessage } from '../ValidatorShared/SubclassMustNotDuplicateEntityPropertyName';
import SymbolTableEntityType from '../SymbolTableEntityType';

const domainEntityIdentifierFinder = (ruleContext: any) => ruleContext.entityName().getText();

const domainEntitySubclassValid =
  valid(SymbolTableEntityType.domainEntity(), SymbolTableEntityType.domainEntitySubclass(), domainEntityIdentifierFinder);

const domainEntitySubclassFailureMessage =
  failureMessage('Domain Entity', SymbolTableEntityType.domainEntity(), SymbolTableEntityType.domainEntitySubclass(), domainEntityIdentifierFinder);

const validationRule = domainEntitySubclassErrorRule(domainEntitySubclassValid, domainEntitySubclassFailureMessage);
export { validationRule as default };

export const includeRule = includeDomainEntitySubclassRule(validationRule);
