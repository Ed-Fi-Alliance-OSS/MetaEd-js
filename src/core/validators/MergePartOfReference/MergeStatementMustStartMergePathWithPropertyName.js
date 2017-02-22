// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import type { ValidatableResult } from '../ValidationTypes';

// TODO: *** Empty validatable implementation until port of C# merge property validator rewrite Jan 2017
// eslint-disable-next-line no-unused-vars
export function validatable(ruleContext: any): ValidatableResult {
  return { validatorName: 'MergeStatementMustStartMergePathWithPropertyName' };
}

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  // TODO: disabling this for now, revisit after validator refactor
  return true;
  /*
  if (!(ruleContext.parentCtx.ruleIndex === MetaEdGrammar.RULE_associationProperty ||
    ruleContext.parentCtx.ruleIndex === MetaEdGrammar.RULE_domainEntityProperty)) return false;
  const firstPropertyPathPart = ruleContext.mergePropertyPath().propertyPath().ID().map(x => x.getText())[0];
  return firstPropertyPathPart === ruleContext.parentCtx.propertyName().ID().getText();
  */
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return 'Merge statement must start first property path with the name of the current property.';
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_mergePartOfReference, validationRule);
