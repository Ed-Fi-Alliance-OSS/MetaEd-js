// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { validatable, valid, failureMessage } from '../ValidatorShared/SubclassMustNotDuplicateEntityPropertyName';
import SymbolTableEntityType from '../SymbolTableEntityType';

const associationIdentifierFinder = (ruleContext: any) => ruleContext.associationName().getText();

const associationSubclassValid =
  valid(SymbolTableEntityType.association(), SymbolTableEntityType.associationSubclass(), associationIdentifierFinder);

const associationSubclassFailureMessage =
  failureMessage('Association', SymbolTableEntityType.association(), SymbolTableEntityType.associationSubclass(), associationIdentifierFinder);

const validationRule =
  errorRuleBase(validatable('AssociationSubclassMustNotDuplicateAssociationPropertyName'), associationSubclassValid, associationSubclassFailureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_associationSubclass, validationRule);
