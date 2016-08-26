import { ValidationRuleBase } from "../ValidationRuleBase";
export class SharedStringPropertyTypeMustMatchACommonSimpleString extends ValidationRuleBase<MetaEdGrammar.SharedStringPropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SharedStringPropertyContext): boolean {
        let identifierToMatch = context.sharedPropertyType().GetText();
        let commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
        return this._symbolTable.IdentifierExists(commonStringType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SharedStringPropertyContext): string {
        return `Shared property '${context.propertyName().GetText()}' does not match any declared common string.`;
    }
}
