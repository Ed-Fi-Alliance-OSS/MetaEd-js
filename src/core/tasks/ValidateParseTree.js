// @flow
import R from 'ramda';
import { tree } from 'antlr4';
import ValidatorListener from '../validators/ValidatorListener';
import type { State } from '../State';
import type { ValidationRuleRepository } from '../validators/ValidationRuleRepository';

// eslint-disable-next-line import/prefer-default-export
export const validateParseTree = R.curry(
  (validationRuleRepository: ValidationRuleRepository, state: State): State => {
    const validatorListener = new ValidatorListener(validationRuleRepository);
    validatorListener.withState(state);
    tree.ParseTreeWalker.DEFAULT.walk(validatorListener, state.get('parseTree'));
    return validatorListener.postValidationState();

    // TODO: error reporting
  });
