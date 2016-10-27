// @flow
import { sharedPropertyErrorRule, includeSharedPropertyRule,
  validForShared, failureMessageForShared } from './SharedPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

const validationRule =
  sharedPropertyErrorRule(validForShared(SymbolTableEntityType.commonShort()), failureMessageForShared('common short'));
export { validationRule as default };

export const includeRule = includeSharedPropertyRule(validationRule);
