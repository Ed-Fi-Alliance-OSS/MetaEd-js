// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBaseForMultiRuleIndexes } from '../ValidationRuleRepository';
import { entityName, entityIdentifier, topLevelEntityRules, topLevelEntityExtensionRules } from '../RuleInformation';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

// WARNING: maintains state
const repository = new Set();

// Domains, Subdomains, Interchanges, enumerations and descriptors don't have standard cross entity naming issues
// and extension entities don't define a new identifier
const relevantEntityRules = R.without(
  R.union([
    MetaEdGrammar.RULE_descriptor,
    MetaEdGrammar.RULE_domain,
    MetaEdGrammar.RULE_enumeration,
    MetaEdGrammar.RULE_interchange,
    MetaEdGrammar.RULE_subdomain,
  ], topLevelEntityExtensionRules),
  topLevelEntityRules);

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const name = entityName(ruleContext);
  if (repository.has(name)) return false;
  repository.add(name);
  return true;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `${entityIdentifier(ruleContext)} named ${entityName(ruleContext)} is a duplicate declaration of that name.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBaseForMultiRuleIndexes(relevantEntityRules, validationRule);
