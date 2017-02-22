// @flow
import R from 'ramda';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import { exceptionPath, propertyName } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

function isNotCommonPropertyContextWithExtension(context: any): boolean {
  if (context.ruleIndex !== MetaEdGrammar.RULE_commonProperty) return true;
  return context.commonExtensionOverride() === null;
}

function propertyRuleContextsForDuplicates(baseKey: string, extensionKey: string, ruleContext: any, symbolTable: SymbolTable): Array<any> {
  const identifier = ruleContext.extendeeName().getText();
  const entityPropertyIdentifiers = symbolTable.identifiersForEntityProperties(baseKey, identifier);
  const duplicates =
    symbolTable.contextsForMatchingPropertyIdentifiers(extensionKey, identifier, Array.from(entityPropertyIdentifiers));
  return duplicates.filter(x => isNotCommonPropertyContextWithExtension(x));
}

export const validatable = R.curry(
  (validatorName: string, ruleContext: any): ValidatableResult => {
    const invalidPath: ?string[] = exceptionPath(['extendeeName'], ruleContext);
    if (invalidPath) return { invalidPath, validatorName };

    return { validatorName };
  });

export const valid = R.curry(
  (entityKey: string, extensionKey: string, ruleContext: any, symbolTable: SymbolTable): boolean =>
    propertyRuleContextsForDuplicates(entityKey, extensionKey, ruleContext, symbolTable).length === 0);

export const failureMessage = R.curry(
  (entityTitle: string, entityKey: string, extensionKey: string, ruleContext: any, symbolTable: SymbolTable): string => {
    const duplicatePropertyIdentifierList =
      propertyRuleContextsForDuplicates(entityKey, extensionKey, ruleContext, symbolTable).map(x => propertyName(x));
    return `${entityTitle} additions '${ruleContext.extendeeName().getText()}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of {entityTitle}.`;
  });
