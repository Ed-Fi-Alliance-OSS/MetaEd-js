// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import { contextMustMatchATopLevelEntity, topLevelEntityAncestorContext } from '../ValidationHelper';
import { entityIdentifier, entityName } from '../TopLevelEntityInformation';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const topLevelEntityContext = topLevelEntityAncestorContext(ruleContext);
  return `Domain item '${ruleContext.ID().getText()}' under ${entityIdentifier(topLevelEntityContext)} '${entityName(topLevelEntityContext)}' does not match any declared abstract entity, domain entity or subclass, association or subclass, or common type.`;
}

const validationRule = errorRuleBase(contextMustMatchATopLevelEntity, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainItem, validationRule);
