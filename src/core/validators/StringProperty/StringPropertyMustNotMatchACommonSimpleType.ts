import { ValidationRuleBase } from "../ValidationRuleBase";

export class StringPropertyMustNotMatchACommonSimpleType extends ValidationRuleBase<MetaEdGrammar.StringPropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.StringPropertyContext): boolean {
        var identifierToMatch = context.propertyName().GetText();
        var commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
        var commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
        var commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        var commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
        return !(this._symbolTable.IdentifierExists(commonDecimalType, identifierToMatch) || this._symbolTable.IdentifierExists(commonIntegerType, identifierToMatch) || this._symbolTable.IdentifierExists(commonShortType, identifierToMatch) || this._symbolTable.IdentifierExists(commonStringType, identifierToMatch));
    }
    public getFailureMessage(context: MetaEdGrammar.StringPropertyContext): string {
        return `String property '${context.propertyName().GetText()}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.`;
    }
}
