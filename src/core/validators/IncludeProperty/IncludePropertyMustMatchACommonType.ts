import { ValidationRuleBase } from "../ValidationRuleBase";
export class IncludePropertyMustMatchACommonType extends ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.IncludePropertyContext): boolean {
        let identifierToMatch = context.propertyName().GetText();
        let commonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE);
        let inlineCommonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.INLINE_COMMON_TYPE);
        let choiceCommonType = MetaEdGrammar.TokenName(MetaEdGrammar.CHOICE_TYPE);
        return this._symbolTable.IdentifierExists(commonTypeType, identifierToMatch) || this._symbolTable.IdentifierExists(inlineCommonTypeType, identifierToMatch) || this._symbolTable.IdentifierExists(choiceCommonType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.IncludePropertyContext): string {
        return `Include property '${context.propertyName().GetText()}' does not match any declared common type.`;
    }
}
