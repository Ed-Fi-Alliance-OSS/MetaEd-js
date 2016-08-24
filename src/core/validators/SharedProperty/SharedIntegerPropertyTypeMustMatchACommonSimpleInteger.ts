import { ValidationRuleBase } from "../ValidationRuleBase";
export class SharedIntegerPropertyTypeMustMatchACommonSimpleInteger extends ValidationRuleBase<MetaEdGrammar.SharedIntegerPropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SharedIntegerPropertyContext): boolean {
        var identifierToMatch = context.sharedPropertyType().GetText();
        var commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
        return this._symbolTable.IdentifierExists(commonIntegerType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SharedIntegerPropertyContext): string {
        return string.Format("Shared property '{0}' does not match any declared common integer.", context.propertyName().GetText());
    }
}
