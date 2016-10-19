// @flow
import { getProperty } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';
import { abstractEntityErrorRule, includeAbstractEntityRule } from './AbstractEntityValidationRule';

function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
    return ruleContext.property().some(x => getProperty(x).propertyComponents().propertyAnnotation().identity() != null);
}

function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
    return `Abstract Entity ${ruleContext.abstractEntityName().ID().getText()} does not have an identity specified.`;
}

const validationRule = abstractEntityErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeAbstractEntityRule(validationRule);
