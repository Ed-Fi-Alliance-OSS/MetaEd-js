// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { validatable, valid, failureMessage } from '../ValidatorShared/ExtensionMustNotDuplicatePropertyName';

const domainEntityExtensionValid =
  valid(SymbolTableEntityType.domainEntity(), SymbolTableEntityType.domainEntityExtension());

const domainEntityExtensionFailureMessage =
  failureMessage('Domain Entity', SymbolTableEntityType.domainEntity(), SymbolTableEntityType.domainEntityExtension());

const validationRule = errorRuleBase(validatable, domainEntityExtensionValid, domainEntityExtensionFailureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainEntityExtension, validationRule);
