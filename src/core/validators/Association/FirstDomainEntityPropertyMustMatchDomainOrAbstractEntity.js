// @flow
import { firstDomainEntityErrorRule, includeFirstDomainEntityRule } from './AssociationValidationRule';
import SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

export function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
    const identifierToMatch = ruleContext.propertyName().ID().getText();
    return symbolTable.identifierExists(SymbolTableEntityType.domainEntityEntityType(), identifierToMatch)
        || symbolTable.identifierExists(SymbolTableEntityType.abstractEntityEntityType(), identifierToMatch)
        || symbolTable.identifierExists(SymbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch);
}

export function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
    return `Domain Entity property '${ruleContext.propertyName().ID().getText()}' does not match any declared domain or abstract entity.`;
}

const validationRule = firstDomainEntityErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeFirstDomainEntityRule(validationRule);