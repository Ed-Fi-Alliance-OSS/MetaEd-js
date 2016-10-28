// @flow
import { sharedIntegerPropertyErrorRule, includeSharedIntegerPropertyRule,
  validForShared, failureMessageForShared } from './SharedPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

const validationRule =
  sharedIntegerPropertyErrorRule(validForShared(SymbolTableEntityType.commonInteger()), failureMessageForShared('common integer'));
export { validationRule as default };

export const includeRule = includeSharedIntegerPropertyRule(validationRule);
