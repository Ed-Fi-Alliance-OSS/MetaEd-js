// @flow
import { sharedPropertyErrorRule, includeSharedPropertyRule,
  validForShared, failureMessageForShared } from './SharedPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

const validationRule =
  sharedPropertyErrorRule(validForShared(SymbolTableEntityType.commonString()), failureMessageForShared('common string'));
export { validationRule as default };

export const includeRule = includeSharedPropertyRule(validationRule);
