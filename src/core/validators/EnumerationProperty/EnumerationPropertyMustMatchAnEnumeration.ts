import { ValidationRuleBase } from "../ValidationRuleBase";
export class EnumerationPropertyMustMatchAnEnumeration extends ValidationRuleBase<MetaEdGrammar.EnumerationPropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.EnumerationPropertyContext): boolean {
        var identifierToMatch = context.propertyName().GetText();
        return this._symbolTable.IdentifierExists(SymbolTableEntityType.EnumerationEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.EnumerationPropertyContext): string {
        return `Enumeration property '${context.propertyName().GetText()}' does not match any declared enumeration.`;
    }
}
