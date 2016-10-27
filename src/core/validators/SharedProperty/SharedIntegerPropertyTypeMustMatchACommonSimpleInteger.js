// @flow
import { sharedPropertyErrorRule, includeSharedPropertyRule,
  validForShared, failureMessageForShared } from './SharedPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

const validationRule =
  sharedPropertyErrorRule(validForShared(SymbolTableEntityType.commonInteger()), failureMessageForShared('common integer'));
export { validationRule as default };

export const includeRule = includeSharedPropertyRule(validationRule);
