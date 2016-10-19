// @flow
import { firstDomainEntityErrorRule, includeFirstDomainEntityRule } from './AssociationValidationRule';
import SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

export function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
    const identifierToMatch = ruleContext.propertyName().ID().getText();
    const withContextContext = ruleContext.withContext();
    const withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().getText();
    const associationName = ruleContext.parentCtx.associationName().ID().getText();
    const entitySymbolTable = symbolTable.get(SymbolTableEntityType.associationEntityType(), associationName);
    if (entitySymbolTable == null) throw new Error("FirstDomainEntityPropertyMustNotCollideWithOtherProperty.valid(): Symbol table entry not found")
    return entitySymbolTable.propertySymbolTable.get(withContextPrefix + identifierToMatch) == null;
}

export function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
    const associationName = ruleContext.parentCtx.associationName().ID().getText();
    return `Entity ${associationName} has duplicate properties named ${ruleContext.propertyName().ID().getText()}`;
}

const validationRule = firstDomainEntityErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeFirstDomainEntityRule(validationRule);
