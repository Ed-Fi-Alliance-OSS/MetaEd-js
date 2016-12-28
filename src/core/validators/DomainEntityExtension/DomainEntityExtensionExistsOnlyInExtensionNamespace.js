// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import { namespaceAncestorContext, namespaceNameFor, exceptionPath } from '../ValidationHelper';
import { valid } from '../AssociationExtension/AssociationExtensionExistsOnlyInExtensionNamespace';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'DomainEntityExtensionExistsOnlyInExtensionNamespace';
  const invalidPath: ?string[] = exceptionPath(['extendeeName'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentNamespaceContext = namespaceAncestorContext(ruleContext);
  return `Domain Entity additions '${ruleContext.extendeeName().getText()}' is not valid in core namespace '${namespaceNameFor(parentNamespaceContext)}`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainEntityExtension, validationRule);
