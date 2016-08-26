import { ValidationRuleBase } from "../ValidationRuleBase";
export class SharedShortPropertyTypeMustMatchACommonSimpleShort extends ValidationRuleBase<MetaEdGrammar.SharedShortPropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SharedShortPropertyContext): boolean {
        let identifierToMatch = context.sharedPropertyType().GetText();
        let commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        return this._symbolTable.IdentifierExists(commonShortType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SharedShortPropertyContext): string {
        return `Shared property '${context.propertyName().GetText()}' does not match any declared common short.`;
    }
}
