import { ValidationRuleBase } from "../ValidationRuleBase";
export class IncludePropertyMustMatchACommonType extends ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.IncludePropertyContext): boolean {
        var identifierToMatch = context.propertyName().GetText();
        var commonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE);
        var inlineCommonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.INLINE_COMMON_TYPE);
        var choiceCommonType = MetaEdGrammar.TokenName(MetaEdGrammar.CHOICE_TYPE);
        return this._symbolTable.IdentifierExists(commonTypeType, identifierToMatch) || this._symbolTable.IdentifierExists(inlineCommonTypeType, identifierToMatch) || this._symbolTable.IdentifierExists(choiceCommonType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.IncludePropertyContext): string {
        return string.Format("Include property '{0}' does not match any declared common type.", context.propertyName().GetText());
    }
}
