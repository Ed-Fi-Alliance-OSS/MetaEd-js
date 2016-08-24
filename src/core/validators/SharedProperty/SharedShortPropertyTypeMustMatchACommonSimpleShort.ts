import { ValidationRuleBase } from "../ValidationRuleBase";
export class SharedShortPropertyTypeMustMatchACommonSimpleShort extends ValidationRuleBase<MetaEdGrammar.SharedShortPropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SharedShortPropertyContext): boolean {
        var identifierToMatch = context.sharedPropertyType().GetText();
        var commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        return this._symbolTable.IdentifierExists(commonShortType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SharedShortPropertyContext): string {
        return string.Format("Shared property '{0}' does not match any declared common short.", context.propertyName().GetText());
    }
}
