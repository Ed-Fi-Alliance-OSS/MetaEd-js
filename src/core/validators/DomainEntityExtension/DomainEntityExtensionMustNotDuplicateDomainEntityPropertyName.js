// @flow
import { domainEntityExtensionErrorRule, includeDomainEntityExtensionRule } from './DomainEntityExtensionValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { valid, failureMessage } from '../ExtensionMustNotDuplicatePropertyName';

const domainEntityExtensionValid =
  valid(SymbolTableEntityType.domainEntity(), SymbolTableEntityType.domainEntityExtension());

const domainEntityExtensionFailureMessage =
  failureMessage('Domain Entity', SymbolTableEntityType.domainEntity(), SymbolTableEntityType.domainEntityExtension());

const validationRule = domainEntityExtensionErrorRule(domainEntityExtensionValid, domainEntityExtensionFailureMessage);
export { validationRule as default };

export const includeRule = includeDomainEntityExtensionRule(validationRule);
