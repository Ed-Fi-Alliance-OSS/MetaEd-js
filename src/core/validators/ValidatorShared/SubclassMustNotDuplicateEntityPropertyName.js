// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';

export const valid = R.curry(
  (baseKey: string,
   subclassKey: string,
   identifierFinder: (ruleContext: any) => string,
   ruleContext: any,
   symbolTable: SymbolTable): boolean => {
    const identifier = identifierFinder(ruleContext);
    const baseIdentifier = ruleContext.baseName().getText();
    const basePropertyIdentifiers = symbolTable.identifiersForEntityProperties(baseKey, baseIdentifier);
    const subclassPropertyIdentifiers = symbolTable.identifiersForEntityProperties(subclassKey, identifier);
    return R.intersection(Array.from(basePropertyIdentifiers), Array.from(subclassPropertyIdentifiers)).length === 0;
  }
);

export const failureMessage = R.curry(
  (entityTitle: string,
   baseKey: string,
   subclassKey: string,
   identifierFinder: (ruleContext: any) => string,
   ruleContext: any,
   symbolTable: SymbolTable): string => {
    const identifier = identifierFinder(ruleContext);
    const baseIdentifier = ruleContext.baseName().getText();
    const entityPropertyIdentifiers = Array.from(symbolTable.identifiersForEntityProperties(baseKey, baseIdentifier));
    const propertyRuleContextsForDuplicates =
      symbolTable.contextsForMatchingPropertyIdentifiers(subclassKey, identifier, entityPropertyIdentifiers);
    const duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.map(x => x.propertyName().ID().getText());
    return `${entityTitle} '${identifier}' based on '${baseIdentifier}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of base ${entityTitle}.`;
  }
);
