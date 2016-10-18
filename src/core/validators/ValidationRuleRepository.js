// @flow
import R from 'ramda';
import { Map, List } from 'immutable';
import type { ValidationRule } from './ValidationRuleBase';

// include list appender curried for composition
function includeRuleBase(ruleIndex: number, validationRule: ValidationRule, includeList: ValidationRuleRepository): ValidationRuleRepository {
    const ruleList = includeList.get(ruleIndex);
    if (ruleList == null) {
        return includeList.set(ruleIndex, List.of(validationRule));
    } else {
        return includeList.set(ruleIndex, ruleList.push(validationRule));
    }
}

export const includeRule = R.curry(includeRuleBase);

export function newRepository() : ValidationRuleRepository {
    return new Map();
}

export type ValidationRuleRepository = Map<number, List<ValidationRule>>;

