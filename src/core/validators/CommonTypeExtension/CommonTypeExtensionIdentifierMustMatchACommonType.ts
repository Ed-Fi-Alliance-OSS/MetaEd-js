import { ValidationRuleBase } from "../ValidationRuleBase";
export class CommonTypeExtensionIdentifierMustMatchACommonType extends ValidationRuleBase<MetaEdGrammar.CommonTypeExtensionContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.CommonTypeExtensionContext): boolean {
        var entityType = context.COMMON_TYPE().GetText();
        var identifier = context.extendeeName().GetText();
        return this._symbolTable.IdentifiersForEntityType(entityType).Any(x => x.Equals(identifier));
    }
    public getFailureMessage(context: MetaEdGrammar.CommonTypeExtensionContext): string {
        return `Common Type additions '${context.extendeeName().GetText()}' does not match any declared Common Type.`;
    }
}
