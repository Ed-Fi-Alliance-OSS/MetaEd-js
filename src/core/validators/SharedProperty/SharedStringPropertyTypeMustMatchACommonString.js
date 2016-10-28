// @flow
import { sharedStringPropertyErrorRule, includeSharedStringPropertyRule,
  validForShared, failureMessageForShared } from './SharedPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

const validationRule =
  sharedStringPropertyErrorRule(validForShared(SymbolTableEntityType.commonString()), failureMessageForShared('common string'));
export { validationRule as default };

export const includeRule = includeSharedStringPropertyRule(validationRule);
