import { ValidationRuleBase } from "../ValidationRuleBase";
export class DecimalPropertyMustNotMatchACommonSimpleType extends ValidationRuleBase<MetaEdGrammar.DecimalPropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DecimalPropertyContext): boolean {
        let identifierToMatch = context.propertyName().GetText();
        let commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
        let commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
        let commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        let commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
        return !(this._symbolTable.IdentifierExists(commonDecimalType, identifierToMatch) || this._symbolTable.IdentifierExists(commonIntegerType, identifierToMatch) || this._symbolTable.IdentifierExists(commonShortType, identifierToMatch) || this._symbolTable.IdentifierExists(commonStringType, identifierToMatch));
    }
    public getFailureMessage(context: MetaEdGrammar.DecimalPropertyContext): string {
        return `Decimal property '${context.propertyName().GetText()}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.`;
    }
}
