// @flow
import R from 'ramda';

import ValidationLevel from '../ValidationLevel';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import validationRuleBase, { getProperty } from '../ValidationRuleBase';
import SymbolTable from '../SymbolTable';

const level = ValidationLevel.Error;

function handled(ruleContext: any) : boolean {
    return ruleContext.ruleIndex === MetaEdGrammar.RULE_abstractEntity;
}

function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
    return ruleContext.property().some(x => getProperty(x).propertyComponents().propertyAnnotation().identity() != null);
}

function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
    return `Abstract Entity ${ruleContext.abstractEntityName().ID().getText()} does not have an identity specified.`;
}

const validationRule = R.partial(validationRuleBase, [level, handled, valid, failureMessage]);
export { validationRule as default };
