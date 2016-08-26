import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class EnumerationPropertyMustMatchAnEnumeration extends ValidationRuleBase<MetaEdGrammar.EnumerationPropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.EnumerationPropertyContext): boolean {
        let identifierToMatch = context.propertyName().GetText();
        return this.symbolTable.identifierExists(SymbolTableEntityType.EnumerationEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.EnumerationPropertyContext): string {
        return `Enumeration property '${context.propertyName().GetText()}' does not match any declared enumeration.`;
    }
}
