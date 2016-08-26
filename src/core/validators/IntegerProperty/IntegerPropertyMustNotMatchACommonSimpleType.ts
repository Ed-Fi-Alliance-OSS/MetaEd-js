import { ValidationRuleBase } from "../ValidationRuleBase";
export class IntegerPropertyMustNotMatchACommonSimpleType extends ValidationRuleBase<MetaEdGrammar.IntegerPropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.IntegerPropertyContext): boolean {
        let identifierToMatch = context.propertyName().GetText();
        let commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
        let commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
        let commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        let commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
        return !(this._symbolTable.IdentifierExists(commonDecimalType, identifierToMatch) || this._symbolTable.IdentifierExists(commonIntegerType, identifierToMatch) || this._symbolTable.IdentifierExists(commonShortType, identifierToMatch) || this._symbolTable.IdentifierExists(commonStringType, identifierToMatch));
    }
    public getFailureMessage(context: MetaEdGrammar.IntegerPropertyContext): string {
        return `Integer property '${context.propertyName().GetText()}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.`;
    }
}
