// @flow
import { sharedPropertyErrorRule, includeSharedPropertyRule,
  validForShared, failureMessageForShared } from './SharedPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

const validationRule =
  sharedPropertyErrorRule(validForShared(SymbolTableEntityType.commonDecimal()), failureMessageForShared('common decimal'));
export { validationRule as default };

export const includeRule = includeSharedPropertyRule(validationRule);
