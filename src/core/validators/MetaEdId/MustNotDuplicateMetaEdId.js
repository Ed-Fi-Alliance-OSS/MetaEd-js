// @flow
import R from 'ramda';
import { Set } from 'immutable';
import { addAction, setValidatorData } from '../../State';
import { errorRuleBaseStateModifying } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type { State } from '../../State';
import type SymbolTable from '../SymbolTable';

function validAndNextState(ruleContext: any, state: State): { isValid: boolean, nextState: State } {
  const validatorData = state.get('validatorData');
  const repository = validatorData.get('MustNotDuplicateMetaEdIdsRepository', Set());

  const metaEdId: string = ruleContext.METAED_ID().getText();
  if (repository.has(metaEdId)) return { isValid: false, nextState: state };

  const nextValidatorData = validatorData.set('MustNotDuplicateMetaEdIdsRepository', repository.add(metaEdId));
  const nextState = R.pipe(setValidatorData(nextValidatorData), addAction('MustNotDuplicateMetaEdIds'))(state);

  return { isValid: true, nextState };
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `MetaEdId '${ruleContext.METAED_ID().getText()}' exists on multiple entities.  All MetaEdIds must be globally unique.`;
}

const validationRule = errorRuleBaseStateModifying(validAndNextState, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_metaEdId, validationRule);
