// @flow
import R from 'ramda';
import { tree } from 'antlr4';
import ValidatorListener from '../validators/ValidatorListener';
import type { State } from '../State';
import type { ValidationRuleRepository } from '../validators/ValidationRuleRepository';

export const validateParseTree = R.curry(
  (validationRuleRepository: ValidationRuleRepository, state: State): State => {
    const validatorListener = new ValidatorListener(validationRuleRepository, state);
    tree.ParseTreeWalker.DEFAULT.walk(validatorListener, state.parseTree);
    return validatorListener.postValidationState();

    // TODO: error reporting
  }
);
