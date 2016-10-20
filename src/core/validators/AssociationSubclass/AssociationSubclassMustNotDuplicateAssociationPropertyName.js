// @flow
import R from 'ramda';
import { associationSubclassErrorRule, includeAssociationSubclassRule } from './AssociationSubclassValidationRule';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
  const identifier = ruleContext.associationName().getText();
  const baseIdentifier = ruleContext.baseName().getText();
  const basePropertyIdentifiers = symbolTable.identifiersForEntityProperties(SymbolTableEntityType.association(), baseIdentifier);
  const subclassPropertyIdentifiers = symbolTable.identifiersForEntityProperties(SymbolTableEntityType.associationSubclass(), identifier);
  return R.intersection(Array.from(basePropertyIdentifiers), Array.from(subclassPropertyIdentifiers)).length === 0;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
  const identifier = ruleContext.associationName().getText();
  const baseIdentifier = ruleContext.baseName().getText();
  const associationPropertyIdentifiers = Array.from(symbolTable.identifiersForEntityProperties(SymbolTableEntityType.association(), baseIdentifier));
  const propertyRuleContextsForDuplicates =
    symbolTable.contextsForMatchingPropertyIdentifiers(SymbolTableEntityType.associationSubclass(), identifier, associationPropertyIdentifiers);
  const duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.map(x => x.propertyName().ID().getText());
  return `Association '${identifier}' based on '${baseIdentifier}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of base Association.`;
}

const validationRule = associationSubclassErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeAssociationSubclassRule(validationRule);
