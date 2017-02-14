// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { exceptionPath } from '../ValidationHelper';
import SymbolTableEntityType from '../SymbolTableEntityType';
import type { ValidatableResult } from '../ValidationTypes';

export const validatable = R.curry(
  (validatorName: string, ruleContext: any): ValidatableResult => {
    const invalidPath: ?string[] = exceptionPath(['extendeeName'], ruleContext);
    if (invalidPath) return { invalidPath, validatorName };

    return { validatorName };
  });

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifier = ruleContext.extendeeName().getText();
  const commonPropertyIdentifiers = symbolTable.identifiersForEntityProperties(SymbolTableEntityType.common(), identifier);
  const extensionPropertyIdentifiers = symbolTable.identifiersForEntityProperties(SymbolTableEntityType.commonExtension(), identifier);
  return R.intersection(Array.from(commonPropertyIdentifiers), Array.from(extensionPropertyIdentifiers)).length === 0;
}

function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const identifier = ruleContext.extendeeName().getText();
  const commonPropertyIdentifiers =
    Array.from(symbolTable.identifiersForEntityProperties(SymbolTableEntityType.common(), identifier));
  const propertyRuleContextsForDuplicates =
    symbolTable.contextsForMatchingPropertyIdentifiers(SymbolTableEntityType.commonExtension(), identifier, commonPropertyIdentifiers);
  const duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.map(x => x.propertyName().ID().getText());
  return `Common Type additions '${identifier}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of Common Type.`;
}

const validationRule = errorRuleBase(validatable('CommonTypeExtensionMustNotDuplicateCommonTypePropertyName'), valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_commonExtension, validationRule);
