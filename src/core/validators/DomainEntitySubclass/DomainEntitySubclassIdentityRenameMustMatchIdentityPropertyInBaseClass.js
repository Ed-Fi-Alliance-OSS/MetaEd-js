// @flow
import { domainEntitySubclassErrorRule, includeDomainEntitySubclassRule } from './DomainEntitySubclassValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { valid, failureMessage } from '../ValidatorShared/SubclassIdentityRenameMustMatchIdentityPropertyInBaseClass';

const associationSubclassValid = valid(SymbolTableEntityType.domainEntity());
const associationSubclassFailureMessage =
  failureMessage('Domain Entity', (ruleContext: any) => ruleContext.entityName().getText());

const validationRule = domainEntitySubclassErrorRule(associationSubclassValid, associationSubclassFailureMessage);
export { validationRule as default };

export const includeRule = includeDomainEntitySubclassRule(validationRule);
