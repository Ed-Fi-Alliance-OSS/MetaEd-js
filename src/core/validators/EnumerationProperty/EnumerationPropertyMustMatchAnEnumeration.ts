import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
export class EnumerationPropertyMustMatchAnEnumeration extends ValidationRuleBase<MetaEdGrammar.EnumerationPropertyContext>
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.EnumerationPropertyContext): boolean {
        let identifierToMatch = context.propertyName().GetText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.enumerationEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.EnumerationPropertyContext): string {
        return `Enumeration property '${context.propertyName().GetText()}' does not match any declared enumeration.`;
    }
}
