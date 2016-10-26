// @flow
import { associationSubclassErrorRule, includeAssociationSubclassRule } from './AssociationSubclassValidationRule';
import { valid, failureMessage } from '../ValidatorShared/SubclassMustNotDuplicateEntityPropertyName';
import SymbolTableEntityType from '../SymbolTableEntityType';

const associationIdentifierFinder = (ruleContext: any) => ruleContext.associationName().getText();

const associationSubclassValid =
  valid(SymbolTableEntityType.association(), SymbolTableEntityType.associationSubclass(), associationIdentifierFinder);

const associationSubclassFailureMessage =
  failureMessage('Association', SymbolTableEntityType.association(), SymbolTableEntityType.associationSubclass(), associationIdentifierFinder);

const validationRule = associationSubclassErrorRule(associationSubclassValid, associationSubclassFailureMessage);
export { validationRule as default };

export const includeRule = includeAssociationSubclassRule(validationRule);
