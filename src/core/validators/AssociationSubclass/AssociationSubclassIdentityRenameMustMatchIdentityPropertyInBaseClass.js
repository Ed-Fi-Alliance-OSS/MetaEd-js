// @flow
import { associationSubclassErrorRule, includeAssociationSubclassRule } from './AssociationSubclassValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { valid, failureMessage } from '../ValidatorShared/SubclassIdentityRenameMustMatchIdentityPropertyInBaseClass';

const associationSubclassValid = valid(SymbolTableEntityType.association());
const associationSubclassFailureMessage =
  failureMessage('Association', (ruleContext: any) => ruleContext.associationName().getText());

const validationRule = associationSubclassErrorRule(associationSubclassValid, associationSubclassFailureMessage);
export { validationRule as default };

export const includeRule = includeAssociationSubclassRule(validationRule);
