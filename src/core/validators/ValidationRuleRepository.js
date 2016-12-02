// @flow
import R from 'ramda';
import { Map, List } from 'immutable';
import type { ValidationRule } from './ValidationRuleBase';

export type ValidationRuleRepository = Map<number, List<ValidationRule>>;

export const includeRuleBase = R.curry(
  (ruleIndex: number, validationRule: ValidationRule, includeList: ValidationRuleRepository): ValidationRuleRepository => {
    const ruleList = includeList.get(ruleIndex);
    if (ruleList == null) {
      return includeList.set(ruleIndex, List.of(validationRule));
    }

    return includeList.set(ruleIndex, ruleList.push(validationRule));
  });

export const includeRuleBaseForMultiRuleIndexes = R.curry(
  (ruleIndexes: number[], validationRule: ValidationRule, includeList: ValidationRuleRepository): ValidationRuleRepository => {
    let currentRepository = includeList;
    ruleIndexes.forEach(ruleIndex => {
      currentRepository = includeRuleBase(ruleIndex, validationRule, currentRepository);
    });
    return currentRepository;
  });

export function newRepository(): ValidationRuleRepository {
  return new Map();
}
