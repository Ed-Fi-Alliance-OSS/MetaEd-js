// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { validatable, valid, failureMessage } from '../ValidatorShared/SubclassMustNotDuplicateEntityPropertyName';
import SymbolTableEntityType from '../SymbolTableEntityType';

const domainEntityIdentifierFinder = (ruleContext: any) => ruleContext.entityName().getText();

const domainEntitySubclassValid =
  valid(SymbolTableEntityType.domainEntity(), SymbolTableEntityType.domainEntitySubclass(), domainEntityIdentifierFinder);

const domainEntitySubclassFailureMessage =
  failureMessage('Domain Entity', SymbolTableEntityType.domainEntity(), SymbolTableEntityType.domainEntitySubclass(), domainEntityIdentifierFinder);

const validationRule = errorRuleBase(validatable('DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName'), domainEntitySubclassValid, domainEntitySubclassFailureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainEntitySubclass, validationRule);
