// @flow
import R from 'ramda';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import { exceptionPath, namespaceAncestorContext, isExtensionNamespace, namespaceNameFor } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

export const validatable = R.curry(
  (validatorName: string, ruleContext: any): ValidatableResult => {
    const invalidPath: ?string[] = exceptionPath(['extendeeName'], ruleContext);
    if (invalidPath) return { invalidPath, validatorName };

    return { validatorName };
  });

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const parentNamespaceContext = namespaceAncestorContext(ruleContext);
  return isExtensionNamespace(parentNamespaceContext);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentNamespaceContext = namespaceAncestorContext(ruleContext);
  return `Association additions '${ruleContext.extendeeName().getText()}' is not valid in core namespace '${namespaceNameFor(parentNamespaceContext)}`;
}

const validationRule = errorRuleBase(validatable('AssociationExtensionExistsOnlyInExtensionNamespace'), valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_associationExtension, validationRule);
