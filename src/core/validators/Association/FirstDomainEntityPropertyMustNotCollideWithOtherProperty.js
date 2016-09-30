// @flow
import R from 'ramda';

import ValidationLevel from '../ValidationLevel';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import validationRuleBase from '../ValidationRuleBase';
import SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

const level = ValidationLevel.Error;

function handled(ruleContext: any) : boolean {
    return ruleContext.ruleIndex === MetaEdGrammar.RULE_firstDomainEntity;
}

export function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
    const identifierToMatch = ruleContext.propertyName().ID().getText();
    const withContextContext = ruleContext.withContext();
    const withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().getText();
    const associationName = ruleContext.parentCtx.associationName().ID().getText();
    const entitySymbolTable = symbolTable.get(SymbolTableEntityType.associationEntityType(), associationName);
    return entitySymbolTable.propertySymbolTable.get(withContextPrefix + identifierToMatch) == null;
}

export function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
    const associationName = ruleContext.parentCtx.associationName().ID().getText();
    return `Entity ${associationName} has duplicate properties named ${ruleContext.propertyName().ID().getText()}`;
}

const validationRule = R.partial(validationRuleBase, [level, handled, valid, failureMessage]);
export { validationRule as default };