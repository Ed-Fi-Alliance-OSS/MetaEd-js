import { ValidationRuleBase } from "../ValidationRuleBase";
export class InterchangeExtensionIdentifierMustMatchAnInterchange extends ValidationRuleBase<MetaEdGrammar.InterchangeExtensionContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.InterchangeExtensionContext): boolean {
        let entityType = context.INTERCHANGE().GetText();
        let identifier = context.extendeeName().GetText();
        return this._symbolTable.IdentifiersForEntityType(entityType).Any(x => x.Equals(identifier));
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeExtensionContext): string {
        return `Interchange additions '${context.extendeeName().GetText()}' does not match any declared Interchange.`;
    }
}
