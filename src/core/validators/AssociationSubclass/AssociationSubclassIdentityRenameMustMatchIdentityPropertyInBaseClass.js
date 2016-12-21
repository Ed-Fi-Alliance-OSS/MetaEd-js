// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { validatable, valid, failureMessage } from '../ValidatorShared/SubclassIdentityRenameMustMatchIdentityPropertyInBaseClass';

const associationSubclassValid = valid(SymbolTableEntityType.association());
const associationSubclassFailureMessage =
  failureMessage('Association', (ruleContext: any) => ruleContext.associationName().getText());

const validationRule =
  errorRuleBase(validatable('AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass'), associationSubclassValid, associationSubclassFailureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_associationSubclass, validationRule);
