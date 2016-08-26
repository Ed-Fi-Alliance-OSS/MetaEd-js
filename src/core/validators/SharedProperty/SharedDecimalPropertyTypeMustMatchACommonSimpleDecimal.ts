import { ValidationRuleBase } from "../ValidationRuleBase";
export class SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal extends ValidationRuleBase<MetaEdGrammar.SharedDecimalPropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SharedDecimalPropertyContext): boolean {
        let identifierToMatch = context.sharedPropertyType().GetText();
        let commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
        return this._symbolTable.IdentifierExists(commonDecimalType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SharedDecimalPropertyContext): string {
        return `Shared property '${}' does not match any declared common decimal.", context.propertyName().GetText());
    }
}
