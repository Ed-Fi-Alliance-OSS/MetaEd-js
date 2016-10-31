// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import repository from './MetaEdIdTrackerRepository';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const metaEdId: string = ruleContext.METAED_ID().getText();
  if (repository.has(metaEdId)) return false;
  repository.add(metaEdId);
  return true;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `MetaEdId '${ruleContext.METAED_ID().getText()}' exists on multiple entities.  All MetaEdIds must be globally unique.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_metaEdId, validationRule);
