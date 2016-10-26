// @flow
import { associationExtensionErrorRule, includeAssociationExtensionRule } from './AssociationExtensionValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { valid, failureMessage } from '../ValidatorShared/ExtensionMustNotDuplicatePropertyName';

const associationExtensionValid =
  valid(SymbolTableEntityType.association(), SymbolTableEntityType.associationExtension());

const associationExtensionFailureMessage =
  failureMessage('Association', SymbolTableEntityType.association(), SymbolTableEntityType.associationExtension());

const validationRule = associationExtensionErrorRule(associationExtensionValid, associationExtensionFailureMessage);
export { validationRule as default };

export const includeRule = includeAssociationExtensionRule(validationRule);
