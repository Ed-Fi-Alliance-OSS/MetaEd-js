// @flow
import R from 'ramda';

import ValidationLevel from '../ValidationLevel';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import validationRuleBase from '../ValidationRuleBase';
import SymbolTable from '../SymbolTable';

const level = ValidationLevel.Error;

function handled(ruleContext: any) : boolean {
    return ruleContext.ruleIndex === MetaEdGrammar.RULE_association;
}

function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
    const firstDomainEntityName = ruleContext.firstDomainEntity().propertyName().ID().getText();
    const secondDomainEntityName = ruleContext.secondDomainEntity().propertyName().ID().getText();
    if (firstDomainEntityName !== secondDomainEntityName) return true;
    const firstContext = ruleContext.firstDomainEntity().withContext();
    const secondContext = ruleContext.secondDomainEntity().withContext();
    const firstContextName = firstContext == null ? "" : firstContext.withContextName().ID().getText();
    const secondContextName = secondContext == null ? "" : secondContext.withContextName().ID().getText();
    return firstContextName !== secondContextName;
}

function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
    const identifier = ruleContext.associationName().getText();
    const firstDomainEntityName = ruleContext.firstDomainEntity().propertyName().ID().getText();
    return `Association '${identifier}' has duplicate declarations of Domain Entity '${firstDomainEntityName}'`;
}

const validationRule = R.partial(validationRuleBase, [level, handled, valid, failureMessage]);
export { validationRule as default };
