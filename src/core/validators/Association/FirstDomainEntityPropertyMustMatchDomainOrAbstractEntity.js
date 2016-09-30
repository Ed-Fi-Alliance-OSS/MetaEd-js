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
    return symbolTable.identifierExists(SymbolTableEntityType.domainEntityEntityType(), identifierToMatch)
        || symbolTable.identifierExists(SymbolTableEntityType.abstractEntityEntityType(), identifierToMatch)
        || symbolTable.identifierExists(SymbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch);
}

export function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
    return `Domain Entity property '${ruleContext.propertyName().ID().getText()}' does not match any declared domain or abstract entity.`;
}

const validationRule = R.partial(validationRuleBase, [level, handled, valid, failureMessage]);
export { validationRule as default };
