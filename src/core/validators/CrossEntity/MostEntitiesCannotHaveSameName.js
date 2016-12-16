// @flow
import R from 'ramda';
import { Set } from 'immutable';
import { addAction, setValidatorData } from '../../State';
import { errorRuleBaseStateModifying } from '../ValidationRuleBase';
import { includeRuleBaseForMultiRuleIndexes } from '../ValidationRuleRepository';
import { entityName, entityIdentifier, topLevelEntityRules, topLevelEntityExtensionRules } from '../RuleInformation';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type { State } from '../../State';
import type SymbolTable from '../SymbolTable';

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

function validAndNextState(ruleContext: any, state: State): { isValid: boolean, nextState: State } {
  const validatorData = state.get('validatorData');
  const repository = validatorData.get('MostEntitiesCannotHaveSameNameRepository', Set());

  const name: string = entityName(ruleContext);
  if (repository.has(name)) return { isValid: false, nextState: state };

  const nextValidatorData = validatorData.set('MostEntitiesCannotHaveSameNameRepository', repository.add(name));
  const nextState = R.pipe(setValidatorData(nextValidatorData), addAction('MostEntitiesCannotHaveSameName'))(state);

  return { isValid: true, nextState };
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `${entityIdentifier(ruleContext)} named ${entityName(ruleContext)} is a duplicate declaration of that name.`;
}

const validationRule = errorRuleBaseStateModifying(validAndNextState, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBaseForMultiRuleIndexes(relevantEntityRules, validationRule);
