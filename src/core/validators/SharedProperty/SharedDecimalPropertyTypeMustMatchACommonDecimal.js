// @flow
import { sharedDecimalPropertyErrorRule, includeSharedDecimalPropertyRule,
  validForShared, failureMessageForShared } from './SharedPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

const validationRule =
  sharedDecimalPropertyErrorRule(validForShared(SymbolTableEntityType.commonDecimal()), failureMessageForShared('common decimal'));
export { validationRule as default };

export const includeRule = includeSharedDecimalPropertyRule(validationRule);
