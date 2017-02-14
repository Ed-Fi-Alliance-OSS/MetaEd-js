// @flow
import R from 'ramda';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { exceptionPath } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';
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
  return Array.from(symbolTable.identifiersForEntityType(SymbolTableEntityType.common())).some(x => x === identifier);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Common Type additions '${ruleContext.extendeeName().getText()}' does not match any declared Common Type.`;
}

const validationRule = errorRuleBase(validatable('CommonTypeExtensionIdentifierMustMatchACommonType'), valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_commonExtension, validationRule);
