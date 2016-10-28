// @flow
import { sharedShortPropertyErrorRule, includeSharedShortPropertyRule,
  validForShared, failureMessageForShared } from './SharedPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

const validationRule =
  sharedShortPropertyErrorRule(validForShared(SymbolTableEntityType.commonShort()), failureMessageForShared('common short'));
export { validationRule as default };

export const includeRule = includeSharedShortPropertyRule(validationRule);
