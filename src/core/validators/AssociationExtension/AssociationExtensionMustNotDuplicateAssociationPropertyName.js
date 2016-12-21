// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { validatable, valid, failureMessage } from '../ValidatorShared/ExtensionMustNotDuplicatePropertyName';

const associationExtensionValid =
  valid(SymbolTableEntityType.association(), SymbolTableEntityType.associationExtension());

const associationExtensionFailureMessage =
  failureMessage('Association', SymbolTableEntityType.association(), SymbolTableEntityType.associationExtension());

const validationRule = errorRuleBase(validatable('AssociationExtensionMustNotDuplicateAssociationPropertyName'), associationExtensionValid, associationExtensionFailureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_associationExtension, validationRule);
